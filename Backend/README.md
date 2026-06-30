# Analytics Dashboard – Backend (DRF)

## Quick Start — Docker (recommended)

```bash
docker compose up --build
```

On **first boot** the web container automatically:
1. Applies all migrations
2. Seeds **60 000 keywords + 90 days of metrics + ~10 annotations** (~60 s)
3. Starts the Django development server

On **subsequent boots** step 1 runs (no-op) and step 2 is skipped automatically.

| URL | Description |
|-----|-------------|
| `http://localhost:8090/api/v1/` | API root |
| `http://localhost:8090/api/docs/` | Swagger UI |
| `http://localhost:8090/admin/` | Django admin |

> **Port conflict?**  If another service already uses port 8081, change the host
> port in `docker-compose.yml`: `ports: - "8082:8000"` and access the API on 8082.

---

## Quick Start — Local (without Docker)

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env          

python manage.py migrate
python manage.py seed_data    
python manage.py createsuperuser
python manage.py runserver
```

API root: `http://localhost:8090/api/v1/`
Swagger UI: `http://localhost:8090/api/docs/`
Admin: `http://localhost:8090/admin/`

---

## Project Structure

```
backend/
├── docker-compose.yml
├── Dockerfile
├── manage.py
├── requirements.txt
├── entrypoint.sh
├── .env.example
├── .gitignore
├── config/
│   ├── settings/
│   │   ├── base.py          # shared settings
│   │   ├── development.py   # SQLite, DEBUG=True
│   │   └── production.py    # PostgreSQL, DEBUG=False
│   ├── urls.py              # top-level URL dispatcher
│   └── wsgi.py
└── apps/
    ├── keywords/            # Keyword model + list/filter/sort/search API
    │   ├── models.py
    │   ├── filters.py       # django-filter FilterSet (5 filter dims)
    │   ├── ordering.py      # custom OrderingFilter (supports ?sortBy/sortOrder)
    │   ├── pagination.py    # configurable page sizes: 50/100/250/500
    │   ├── serializers.py   # KeywordSerializer + COLUMN_CONFIG definition
    │   ├── views.py         # KeywordViewSet + ColumnConfigView
    │   └── management/commands/seed_data.py
    ├── analytics/           # Dashboard summary + chart time series
    │   ├── models.py        # DailyMetric (one row per day)
    │   ├── serializers.py
    │   └── views.py         # SummaryView + ChartView
    └── annotations/         # Chart annotation CRUD
        ├── models.py
        ├── serializers.py
        └── views.py         # AnnotationViewSet (full ModelViewSet)
```

---

## API Reference

### Keywords

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/keywords/` | Paginated keyword list |
| GET | `/api/v1/keywords/{id}/` | Single keyword detail |
| GET | `/api/v1/keywords/columns/` | Data-driven column config |

**Query params for the list endpoint:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | int | Page number (default 1) |
| `limit` | int | Page size – 50 \| 100 \| 250 \| 500 |
| `search` | string | Full-text search on `keyword` and `landing_page` |
| `sortBy` | string | Column key to sort on |
| `sortOrder` | `asc` \| `desc` | Sort direction (default `asc`) |
| `ordering` | string | DRF standard (e.g. `-clicks`). Takes priority over `sortBy/sortOrder` |
| `category` | string (repeatable) | `informational` \| `navigational` \| `transactional` \| `commercial` |
| `status` | string (repeatable) | `active` \| `inactive` \| `pending` |
| `device_type` | string (repeatable) | `desktop` \| `mobile` \| `tablet` |
| `source_type` | string (repeatable) | `organic` \| `paid` \| `direct` \| `referral` |
| `rank_min` | float | Minimum rank (inclusive) |
| `rank_max` | float | Maximum rank (inclusive) |
| `is_priority` | bool | `true` \| `false` |

**Paginated response shape:**
```json
{
  "count": 60000,
  "total_pages": 1200,
  "current_page": 1,
  "page_size": 50,
  "next": "http://...",
  "previous": null,
  "results": [ ... ]
}
```

---

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard/summary/` | KPI widget data |
| GET | `/api/v1/dashboard/chart/` | Time series for Insights Chart |

**Summary** accepts the same filter + search params as the keyword list. Both endpoints should be called in parallel with the same params so widgets stay in sync with the table.

**Summary response:**
```json
{
  "total_records": 60000,
  "total_clicks": 2400000000,
  "total_impressions": 9600000000,
  "avg_ctr": "4.20",
  "avg_rank": 28.5,
  "priority_keywords": 4800
}
```

**Chart params:**

| Param | Type | Description |
|-------|------|-------------|
| `date_from` | `YYYY-MM-DD` | Start of date range (inclusive) |
| `date_to` | `YYYY-MM-DD` | End of date range (inclusive) |

**Chart response** – array of daily metric objects:
```json
[
  {
    "date": "2026-04-01",
    "total_clicks": 52000,
    "total_impressions": 490000,
    "avg_ctr": "10.61",
    "avg_rank": 24.3,
    "active_users": 11400,
    "new_users": 3200,
    "engagement_rate": "58.40"
  }
]
```

---

### Annotations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/annotations/` | List all annotations |
| POST | `/api/v1/annotations/` | Create annotation |
| GET | `/api/v1/annotations/{id}/` | Get single annotation |
| PUT | `/api/v1/annotations/{id}/` | Full update |
| PATCH | `/api/v1/annotations/{id}/` | Partial update |
| DELETE | `/api/v1/annotations/{id}/` | Delete |

**Annotation body:**
```json
{
  "date": "2026-06-10",
  "title": "Google Core Update",
  "description": "Major ranking shuffle observed site-wide.",
  "annotation_type": "algorithm_update",
  "created_by": "Jane Smith"
}
```

**`annotation_type` choices:**
`algorithm_update` | `seo_campaign` | `website_migration` | `content_release` | `product_launch` | `other`

**Filter params:**

| Param | Description |
|-------|-------------|
| `date_from` | Annotations on or after this date |
| `date_to` | Annotations on or before this date |
| `annotation_type` | Filter by type (repeatable) |

---

## Architecture Decisions

### 1. Three-app separation
- **keywords** – core data model; all filtering/sorting/search/pagination lives here.
- **analytics** – aggregation layer; summary reads from `Keyword`, chart reads from `DailyMetric`.
- **annotations** – isolated CRUD; annotation data is never mixed with chart metric data (requirement).

### 2. Data-driven column config (`/keywords/columns/`)
`COLUMN_CONFIG` in `serializers.py` is the single source of truth for the table schema.
The frontend reads it once, stores it in state, and renders the table without any hardcoded columns.
Each entry carries `required` (can never be hidden) and `visible` (default visibility) flags.

### 3. Flexible pagination
`FlexiblePageNumberPagination` whitelists exactly the four page sizes from the spec (50/100/250/500) and rejects any other value, defaulting to 50. The response envelope includes `total_pages` and `current_page` so the frontend can render a jump-to-page control.

### 4. Dual sort convention
`SortByOrderingFilter` (extends DRF `OrderingFilter`) understands both:
- DRF standard: `?ordering=-clicks`
- Assignment spec: `?sortBy=clicks&sortOrder=desc`

Standard `?ordering` takes priority when both are present.

### 5. Five filters (exceeds minimum three)
`KeywordFilter` exposes: `category`, `status`, `device_type`, `source_type`, `rank_min/rank_max`, `is_priority`.
All multi-value filters use `MultipleChoiceFilter` so the frontend can pass the same param multiple times (`?category=informational&category=transactional`).

### 6. Pre-aggregated daily metrics
Chart data is pre-aggregated into `DailyMetric` (one row/day) rather than computed on-the-fly from 60 k keyword rows. This keeps chart queries at O(days) instead of O(keywords × days), making them sub-millisecond regardless of keyword count.

### 7. Database indexes
Composite indexes on `(category, status)`, `(device_type, source_type)`, and `(rank, clicks)` ensure the most common multi-column filter combinations stay fast. All filterable and sortable columns carry individual `db_index=True`.

---

## Caching Strategy (Frontend)

The backend itself is stateless. Caching is the frontend's responsibility (per assignment).

**Recommended approach – TanStack Query:**

```ts

const queryKey = ['keywords', { page, limit, search, sortBy, sortOrder, ...filters }];

useQuery({
  queryKey,
  queryFn: () => api.getKeywords(params),
  staleTime: 5 * 60 * 1000,   
  gcTime: 30 * 60 * 1000,     
});
```

When a user returns to Page 1 after visiting Page 2, TanStack Query finds the cached entry for `{ page: 1, ... }` and serves it instantly. The summary and chart share the same cache key strategy.

---

## Seed Data

```bash
# Default: 60 000 keywords, 90 days metrics
python manage.py seed_data

# Smaller dataset for fast iteration
python manage.py seed_data --keywords 5000 --days 30

# Wipe and reseed
python manage.py seed_data --clear
```

---

## Assumptions

1. Authentication is out of scope for this assignment. All endpoints are publicly accessible. In production, add DRF token/JWT auth.
2. The `DailyMetric` table is populated by `seed_data`; in production this would be an nightly aggregation job (Celery beat or a cron-triggered management command).
3. Column visibility preferences (`visible` per column) are stored in the **frontend** (localStorage). The backend `/columns/` endpoint provides defaults; the frontend merges user overrides.
4. Annotation `created_by` is a free-text field (no user model dependency). In production this would be a FK to `auth.User`.
5. The `keyword` field allows duplicate text values (same keyword can appear for different device types / dates). Add a unique constraint per business rules if needed.
6. SQLite is used in development. For 60 k records + sorting + filtering it is adequate locally; use PostgreSQL in staging/production for index efficiency at scale.

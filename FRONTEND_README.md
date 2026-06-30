# Analytics Dashboard

A scalable Analytics Dashboard built with React, JavaScript, and Tailwind CSS.

## Project Setup

```bash
cd Frontend
npm install
npm run dev     # development server (http://localhost:5173)
npm run build   # production build
```

Set the backend URL in `.env`:
```
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

## Architecture Decisions

### Component Structure
```
src/
  api/          # Raw API functions (axios calls)
  hooks/        # TanStack Query wrappers + custom hooks
  components/
    kpi/        # KPI summary card widgets
    chart/      # Insights line chart + annotation modals
    table/      # Data table, filters, column manager, pagination
    ui/         # Shared primitives (Modal, Spinner)
  pages/        # Dashboard page (root of shared state)
  types/        # TypeScript interfaces matching the API
  constants/    # Filter option arrays, colour maps
  lib/          # Axios instance with error interceptor
```

**State flows down from `Dashboard`:** `filters`, `search`, and `dateRange` all live in `Dashboard` and are passed to children. This keeps the KPI widgets, chart, and table in sync from a single source of truth.

### State Management

Local React state via `useState` and `useCallback` — no external store needed because:
- Filter/search/pagination state is co-located in `Dashboard` and `DataTable`
- Column visibility is persisted in `localStorage` and held in `useColumnConfig` via `useState`
- Server state is owned entirely by TanStack Query

### Caching Implementation (TanStack Query)

Every query key encodes all dimensions that affect the response:

| Resource     | Cache key                                         | staleTime   |
|-------------|---------------------------------------------------|-------------|
| Keywords     | `['keywords', { page, limit, search, sort, ...filters }]` | 5 min |
| Summary      | `['summary', { search, ...filters }]`             | 5 min       |
| Chart        | `['chart', { date_from, date_to }]`               | 10 min      |
| Annotations  | `['annotations', { date_from, date_to }]`         | 5 min       |
| Columns      | `['columns']`                                     | ∞           |

**Page navigation caching:** Navigating page 1 → 2 → back to 1 returns the page-1 result from cache (zero network request), controlled by `gcTime: 30 min`.

**Placeholder data:** `placeholderData: (prev) => prev` keeps old rows visible during pagination transitions to avoid layout flicker.

### Key Features

- **KPI Widgets** — 6 cards derived from `/dashboard/summary/`, update with every filter/search change
- **Insights Chart** — Recharts `LineChart` with 7 toggleable metric series; `ReferenceLine` components render annotation markers on the X-axis timeline
- **Annotations** — Full CRUD (create, edit, delete) with type, date, description, and author; stored server-side and overlaid on the chart
- **Data Table** — Server-side pagination (50/100/250/500), multi-column sort, debounced search (300 ms), five filter dimensions (category, status, device type, source type, rank range, priority), dynamic column show/hide
- **Dynamic Columns** — Column schema fetched from `/keywords/columns/` once; visibility overrides persisted in `localStorage`; reactive via `useState`
- **Export** — CSV export of the current page using the Blob API

### Assumptions

- No authentication layer; the API is open on `localhost:8081`
- Annotation data does not need to survive browser refresh without the backend (mutations invalidate the query cache)
- Column order is fixed by the server; only visibility is user-configurable
- Chart does not share the same filter state as the table (per the integration guide state diagram)

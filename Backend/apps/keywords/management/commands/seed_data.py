"""
Seed the database with realistic sample data for the analytics dashboard.

Usage:
    python manage.py seed_data                   # 60 000 keywords, 90 days metrics
    python manage.py seed_data --keywords 10000  # fewer records for quick dev
    python manage.py seed_data --clear           # wipe first, then seed
    python manage.py seed_data --skip-if-exists  # no-op when data already present
"""

import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand
from faker import Faker

from apps.keywords.models import Keyword
from apps.analytics.models import DailyMetric
from apps.annotations.models import Annotation

fake = Faker()

# Weighted pools reflect realistic SEO data distributions
_CATEGORIES = (
    ['informational'] * 4 +
    ['navigational'] * 2 +
    ['transactional'] * 2 +
    ['commercial'] * 2
)
_STATUSES = ['active'] * 7 + ['inactive'] * 2 + ['pending'] * 1
_DEVICE_TYPES = ['desktop'] * 5 + ['mobile'] * 4 + ['tablet'] * 1
_SOURCE_TYPES = ['organic'] * 6 + ['paid'] * 2 + ['direct'] * 1 + ['referral'] * 1

_LANDING_PAGE_PATHS = [
    '/blog/', '/products/', '/category/', '/services/',
    '/about/', '/', '/news/', '/guide/', '/tutorial/', '/review/',
]

_ANNOTATION_TITLES = {
    'algorithm_update': [
        'Google Core Update', 'Google Helpful Content Update',
        'Google Spam Update', 'Google March Core Update', 'Google Page Experience Update',
    ],
    'seo_campaign': [
        'Q1 SEO Campaign Launch', 'Holiday SEO Push',
        'Brand Awareness Campaign', 'Local SEO Initiative',
    ],
    'website_migration': [
        'HTTP to HTTPS Migration', 'Domain Change',
        'CMS Migration', 'URL Structure Redesign',
    ],
    'content_release': [
        'Blog Series Launch', 'Product Guide Published',
        'Case Study Release', 'White Paper Publication',
    ],
    'product_launch': [
        'New Product Line Launch', 'Feature Announcement',
        'Service Update', 'Partnership Announcement',
    ],
}


class Command(BaseCommand):
    help = 'Seed the database with sample analytics data'

    def add_arguments(self, parser):
        parser.add_argument('--keywords', type=int, default=60_000, help='Number of keywords to create')
        parser.add_argument('--days', type=int, default=90, help='Number of days of daily metrics to create')
        parser.add_argument('--clear', action='store_true', help='Delete existing data before seeding')
        parser.add_argument('--skip-if-exists', action='store_true',
                            help='Exit silently if keyword data already exists (used by Docker entrypoint)')

    def handle(self, *args, **options):
        if options['skip_if_exists'] and Keyword.objects.exists():
            self.stdout.write('Data already exists — skipping seed.')
            return

        if options['clear']:
            self.stdout.write('Clearing existing data…')
            Keyword.objects.all().delete()
            DailyMetric.objects.all().delete()
            Annotation.objects.all().delete()
            self.stdout.write('  Done.')

        self._seed_keywords(options['keywords'])
        self._seed_daily_metrics(options['days'])
        self._seed_annotations(options['days'])
        self.stdout.write(self.style.SUCCESS('Seeding complete.'))

    # ------------------------------------------------------------------
    def _seed_keywords(self, total: int):
        self.stdout.write(f'Creating {total:,} keywords…')
        batch_size = 5_000
        buffer = []

        for i in range(1, total + 1):
            monthly_searches = (
                None if random.random() < 0.15
                else random.choice([10, 50, 100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000])
            )

            rank = round(random.uniform(1, 100), 1) if random.random() > 0.08 else None
            if rank is not None:
                delta = random.uniform(-15, 15)
                prev = round(max(1.0, min(100.0, rank + delta)), 1)
            else:
                prev = None

            clicks = random.randint(0, 80_000)
            impressions = max(clicks, int(clicks / max(random.uniform(0.01, 0.30), 0.001)))
            ctr = round((clicks / impressions * 100) if impressions else 0, 2)

            domain = fake.domain_name()
            path = random.choice(_LANDING_PAGE_PATHS) + fake.slug() + '/'

            buffer.append(Keyword(
                keyword=fake.sentence(nb_words=random.randint(1, 6)).rstrip('.').lower(),
                monthly_searches=monthly_searches,
                category=random.choice(_CATEGORIES),
                status=random.choice(_STATUSES),
                rank=rank,
                previous_rank=prev,
                device_type=random.choice(_DEVICE_TYPES),
                source_type=random.choice(_SOURCE_TYPES),
                clicks=clicks,
                impressions=impressions,
                ctr=ctr,
                landing_page=f'https://{domain}{path}',
                is_priority=random.random() < 0.08,
            ))

            if len(buffer) >= batch_size:
                Keyword.objects.bulk_create(buffer, batch_size=batch_size)
                self.stdout.write(f'  {i:,} / {total:,}')
                buffer = []

        if buffer:
            Keyword.objects.bulk_create(buffer, batch_size=batch_size)

        self.stdout.write(self.style.SUCCESS(f'  Created {total:,} keywords.'))

    def _seed_daily_metrics(self, days: int):
        self.stdout.write(f'Creating {days} days of daily metrics…')
        today = date.today()
        metrics = []

        base_clicks = 55_000
        base_impressions = 520_000
        base_users = 12_000

        for offset in range(days - 1, -1, -1):
            d = today - timedelta(days=offset)
            # Simulate gradual growth with realistic noise
            trend = 1 + (offset / days) * 0.25
            noise = random.uniform(0.88, 1.14)
            weekend_dip = 0.80 if d.weekday() >= 5 else 1.0

            total_clicks = int(base_clicks * trend * noise * weekend_dip)
            total_impressions = int(base_impressions * trend * noise * weekend_dip * random.uniform(0.92, 1.08))
            avg_ctr = round((total_clicks / total_impressions * 100) if total_impressions else 0, 2)
            avg_rank = round(random.uniform(12, 48), 1)
            active_users = int(base_users * trend * noise * weekend_dip)
            new_users = int(active_users * random.uniform(0.18, 0.38))
            engagement_rate = round(random.uniform(38, 72), 2)

            metrics.append(DailyMetric(
                date=d,
                total_clicks=total_clicks,
                total_impressions=total_impressions,
                avg_ctr=avg_ctr,
                avg_rank=avg_rank,
                active_users=active_users,
                new_users=new_users,
                engagement_rate=engagement_rate,
            ))

        DailyMetric.objects.bulk_create(metrics, ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS(f'  Created {days} daily metric records.'))

    def _seed_annotations(self, days: int):
        self.stdout.write('Creating annotations…')
        today = date.today()
        count = random.randint(8, 14)
        offsets = random.sample(range(days), count)
        annotations = []

        for offset in offsets:
            d = today - timedelta(days=offset)
            ann_type = random.choice(list(_ANNOTATION_TITLES))
            title = random.choice(_ANNOTATION_TITLES[ann_type])
            annotations.append(Annotation(
                date=d,
                title=title,
                description=fake.text(max_nb_chars=220),
                annotation_type=ann_type,
                created_by=fake.name(),
            ))

        Annotation.objects.bulk_create(annotations)
        self.stdout.write(self.style.SUCCESS(f'  Created {count} annotations.'))

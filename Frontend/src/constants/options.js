export const CATEGORY_OPTIONS = [
  { value: 'informational', label: 'Informational' },
  { value: 'navigational',  label: 'Navigational' },
  { value: 'transactional', label: 'Transactional' },
  { value: 'commercial',    label: 'Commercial' },
];

export const STATUS_OPTIONS = [
  { value: 'active',   label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending',  label: 'Pending' },
];

export const DEVICE_TYPE_OPTIONS = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile',  label: 'Mobile' },
  { value: 'tablet',  label: 'Tablet' },
];

export const SOURCE_TYPE_OPTIONS = [
  { value: 'organic',  label: 'Organic' },
  { value: 'paid',     label: 'Paid' },
  { value: 'direct',   label: 'Direct' },
  { value: 'referral', label: 'Referral' },
];

export const ANNOTATION_TYPE_OPTIONS = [
  { value: 'algorithm_update',  label: 'Google Algorithm Update' },
  { value: 'seo_campaign',      label: 'SEO Campaign Launch' },
  { value: 'website_migration', label: 'Website Migration' },
  { value: 'content_release',   label: 'Content Release' },
  { value: 'product_launch',    label: 'Product Launch' },
  { value: 'other',             label: 'Other' },
];

export const PAGE_SIZE_OPTIONS = [50, 100, 250, 500];

export const ANNOTATION_TYPE_COLORS = {
  algorithm_update:  '#ef4444',
  seo_campaign:      '#3b82f6',
  website_migration: '#f59e0b',
  content_release:   '#10b981',
  product_launch:    '#8b5cf6',
  other:             '#6b7280',
};

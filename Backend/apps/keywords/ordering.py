from rest_framework.filters import OrderingFilter


class SortByOrderingFilter(OrderingFilter):
    """
    Accepts both DRF standard (?ordering=-clicks) and assignment spec
    (?sortBy=clicks&sortOrder=desc). Standard ?ordering takes priority.
    """

    def get_ordering(self, request, queryset, view):
        # Standard DRF ordering param takes priority
        if request.query_params.get(self.ordering_param):
            return super().get_ordering(request, queryset, view)

        sort_by = request.query_params.get('sortBy', '').strip()
        sort_order = request.query_params.get('sortOrder', 'asc').strip().lower()

        if sort_by:
            valid_fields = self.get_valid_fields(queryset, view, {'request': request})
            valid_keys = {f[0] for f in valid_fields}
            if sort_by in valid_keys:
                prefix = '-' if sort_order == 'desc' else ''
                return [f'{prefix}{sort_by}']

        return self.get_default_ordering(view)

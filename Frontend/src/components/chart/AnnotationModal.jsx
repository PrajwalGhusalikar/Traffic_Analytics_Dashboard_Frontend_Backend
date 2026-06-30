import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useCreateAnnotation } from '@/hooks/useCreateAnnotation';
import { useUpdateAnnotation } from '@/hooks/useUpdateAnnotation';
import { useDeleteAnnotation } from '@/hooks/useDeleteAnnotation';
import { ANNOTATION_TYPE_OPTIONS, ANNOTATION_TYPE_COLORS } from '@/constants/options';
import { Spinner } from '@/components/ui/Spinner';

export function AnnotationFormModal({ open, onClose, defaultDate, annotation }) {
  const isEdit = !!annotation;
  const { mutate: create, isPending: creating } = useCreateAnnotation();
  const { mutate: update, isPending: updating } = useUpdateAnnotation();

  const [form, setForm] = useState({
    date:            defaultDate ?? new Date().toISOString().slice(0, 10),
    title:           '',
    description:     '',
    annotation_type: 'algorithm_update',
    created_by:      '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (annotation) {
      setForm({
        date:            annotation.date,
        title:           annotation.title,
        description:     annotation.description,
        annotation_type: annotation.annotation_type,
        created_by:      annotation.created_by,
      });
    } else {
      setForm({
        date:            defaultDate ?? new Date().toISOString().slice(0, 10),
        title:           '',
        description:     '',
        annotation_type: 'algorithm_update',
        created_by:      '',
      });
    }
    setErrors({});
  }, [annotation, defaultDate, open]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim())   errs.title = 'Title is required';
    if (!form.date)           errs.date  = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (isEdit && annotation) {
      update({ id: annotation.id, payload: form }, { onSuccess: onClose });
    } else {
      create(form, { onSuccess: onClose });
    }
  };

  const isPending = creating || updating;

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Annotation' : 'Add Annotation'}>
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Google Core Update"
            maxLength={200}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
          <select
            value={form.annotation_type}
            onChange={e => setForm(f => ({ ...f, annotation_type: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {ANNOTATION_TYPE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Optional description..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
          <input
            type="text"
            value={form.created_by}
            onChange={e => setForm(f => ({ ...f, created_by: e.target.value }))}
            placeholder="Your name"
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Spinner size="sm" className="border-white border-t-blue-200" />}
            {isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function AnnotationsListModal({ open, onClose, annotations, onEdit, onAdd }) {
  const { mutate: remove, isPending: deleting } = useDeleteAnnotation();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id) => {
    setDeletingId(id);
    remove(id, { onSettled: () => setDeletingId(null) });
  };

  return (
    <Modal open={open} onClose={onClose} title="Annotations" maxWidth="max-w-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{annotations.length} annotation{annotations.length !== 1 ? 's' : ''}</p>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Annotation
          </button>
        </div>

        {annotations.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p className="text-gray-400 text-sm">No annotations yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {annotations.map(a => (
              <div key={a.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: ANNOTATION_TYPE_COLORS[a.annotation_type] ?? '#6b7280' }}
                      >
                        {a.annotation_type_display}
                      </span>
                      <span className="text-xs text-gray-400">{a.date}</span>
                    </div>
                    <p className="mt-1.5 font-medium text-gray-900 text-sm">{a.title}</p>
                    {a.description && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{a.description}</p>}
                    {a.created_by && <p className="mt-1 text-xs text-gray-400">By {a.created_by}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEdit(a)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      disabled={deleting && deletingId === a.id}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded disabled:opacity-50"
                    >
                      {deleting && deletingId === a.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

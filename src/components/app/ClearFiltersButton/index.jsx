import { FilterX } from 'lucide-react';

export const ClearFiltersButton = ({ onClick = () => {} }) => (
  <div className="flex justify-end mt-4">
    <button
      type="button"
      onClick={onClick}
      className="btn btn-secondary flex items-center gap-2"
      data-testid="clear-filters-button"
    >
      <FilterX size={16} strokeWidth={1.5} />
      Limpar filtros
    </button>
  </div>
);

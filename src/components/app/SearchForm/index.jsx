import { useState } from 'react';
import { InputField } from '@/components/ui';
import { Search as LucideSearch } from 'lucide-react';

export const SearchForm = ({ placeholder, perform, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Sincroniza com o valor restaurado dos filtros (ex.: ao carregar ou limpar),
  // ajustando o estado durante a render em vez de usar um efeito.
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setSearchTerm(initialValue || '');
  }

  const handleSearch = e => {
    const value = e.target.value;
    setSearchTerm(value);
    perform(value);
  };

  return (
    <div data-testid="search-form">
      <InputField
        htmlFor="search"
        placeholder={placeholder}
        maxLength={200}
        minLength={3}
        value={searchTerm}
        labelClass={'d-none'}
        onChange={handleSearch}
        icon={<LucideSearch className="w-5 h-5" />}
      />
    </div>
  );
};

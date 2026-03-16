import { useState } from 'react';
import { InputField } from '@/components/ui';
import { Search as LucideSearch } from 'lucide-react';

export const SearchForm = ({ placeholder, perform }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = e => {
    const value = e.target.value.trim();
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

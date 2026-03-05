import { useState } from 'react';
import { InputField } from '@/components/ui';

export const SearchForm = ({ placeholder, perform }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = e => {
    const value = e.target.value.trim();
    setSearchTerm(value);
    perform(value);
  };

  return (
    <InputField
      htmlFor="search"
      placeholder={placeholder}
      maxLength={200}
      minLength={3}
      value={searchTerm}
      // inputGroupClass={'pb-4 bg-main'}
      labelClass={'d-none'}
      onChange={handleSearch}
    />
  );
};

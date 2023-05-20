import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  SearchbarTop,
  SearchForm,
  SearchFormInput,
  SearchFormButton,
  SearchFormButtonLabel,
} from './Searchbar.styled';

export function Searchbar({ onSubmit }) {
  const [searchText, setSearchText] = useState('');

  const handleChange = e => {
    setSearchText(e.currentTarget.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (searchText.trim() === '') {
      alert('Enter data for search');
      return;
    }
    onSubmit(searchText);
  };

  return (
    <SearchbarTop>
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <SearchFormButtonLabel>Search</SearchFormButtonLabel>
        </SearchFormButton>

        <SearchFormInput
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchText}
          onChange={handleChange}
        />
      </SearchForm>
    </SearchbarTop>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

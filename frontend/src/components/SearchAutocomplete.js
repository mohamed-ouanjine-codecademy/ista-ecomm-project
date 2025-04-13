// frontend/src/components/SearchAutocomplete.js
import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const SearchAutocomplete = ({ onSelectSuggestion }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    // Only perform a search if there is input.
    if (!inputValue) {
      setOptions([]);
      return undefined;
    }

    // Debounce: Wait a bit before fetching suggestions.
    const delayDebounceFn = setTimeout(() => {
      (async () => {
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/products/suggestions?keyword=${encodeURIComponent(inputValue)}`
          );
          if (active) {
            setOptions(data); // Expect data to be an array of suggestion objects.
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      })();
    }, 300); // 300ms debounce delay

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [inputValue, open]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="search-autocomplete"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(option) => option.name || ''}
      options={options}
      loading={loading}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, value) => {
        if (value) {
          onSelectSuggestion(value);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('search')}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchAutocomplete;

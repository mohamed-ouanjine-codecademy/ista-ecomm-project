// frontend/src/components/AdvancedSearchFilters.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Typography,
  Slider,
  Select,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchAutocomplete from './SearchAutocomplete';

// Sample categories (update as needed)
const categories = [
  { value: '', label: 'All' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Books', label: 'Books' },
  // ... more categories
];

const sortOptions = [
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'bestRated', label: 'Best Rated' },
];

const AdvancedSearchFilters = ({ onFilterChange }) => {
  const { t } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('');

  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onFilterChange({
      keyword,
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      sort,
    });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCategory('');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSort('');
    onFilterChange({});
  };

  // When a suggestion is selected from autocomplete, update the keyword & filters.
  const handleSelectSuggestion = (suggestion) => {
    setKeyword(suggestion.name);
    onFilterChange({
      keyword: suggestion.name,
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      sort,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {/* Use only the SearchAutocomplete as the search input */}
      <SearchAutocomplete onSelectSuggestion={handleSelectSuggestion} />
      
      <FormControl fullWidth>
        <InputLabel id="category-select-label">{t('category')}</InputLabel>
        <Select
          labelId="category-select-label"
          value={category}
          label={t('category')}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Typography gutterBottom>
        {t('priceRange')}: ${priceRange[0]} - ${priceRange[1]}
      </Typography>
      <Slider
        value={priceRange}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={0}
        max={1000}
      />
      
      <Typography gutterBottom>
        {t('minimumRating')}: {minRating} {t('stars')}
      </Typography>
      <RadioGroup
        row
        value={minRating.toString()}
        onChange={(e) => setMinRating(Number(e.target.value))}
      >
        {[0, 1, 2, 3, 4, 5].map((value) => (
          <FormControlLabel
            key={value}
            value={value.toString()}
            control={<Radio />}
            label={value.toString()}
          />
        ))}
      </RadioGroup>
      
      <FormControl fullWidth>
        <InputLabel id="sort-select-label">{t('sortBy')}</InputLabel>
        <Select
          labelId="sort-select-label"
          value={sort}
          label={t('sortBy')}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" type="submit">
          {t('apply')}
        </Button>
        <Button variant="outlined" onClick={handleClearFilters}>
          {t('clearFilters')}
        </Button>
      </Box>
    </Box>
  );
};

export default AdvancedSearchFilters;

// frontend/src/context/ComparisonContext.js
import React, { createContext, useReducer } from 'react';

const initialState = {
  comparisonItems: localStorage.getItem('comparisonItems')
    ? JSON.parse(localStorage.getItem('comparisonItems'))
    : [],
};

export const ComparisonContext = createContext();

const comparisonReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_COMPARISON': {
      const exist = state.comparisonItems.find(item => item._id === action.payload._id);
      if (exist) return state;
      const updated = [...state.comparisonItems, action.payload];
      localStorage.setItem('comparisonItems', JSON.stringify(updated));
      return { comparisonItems: updated };
    }
    case 'REMOVE_FROM_COMPARISON': {
      const updated = state.comparisonItems.filter(item => item._id !== action.payload);
      localStorage.setItem('comparisonItems', JSON.stringify(updated));
      return { comparisonItems: updated };
    }
    case 'CLEAR_COMPARISON': {
      localStorage.removeItem('comparisonItems');
      return { comparisonItems: [] };
    }
    default:
      return state;
  }
};

export const ComparisonProvider = ({ children }) => {
  const [state, dispatch] = useReducer(comparisonReducer, initialState);
  return (
    <ComparisonContext.Provider value={{ state, dispatch }}>
      {children}
    </ComparisonContext.Provider>
  );
};

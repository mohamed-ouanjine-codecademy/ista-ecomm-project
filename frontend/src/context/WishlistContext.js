// frontend/src/context/WishlistContext.js
import React, { createContext, useReducer } from 'react';

const initialState = {
  wishlistItems: localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [],
};

export const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST': {
      const exist = state.wishlistItems.find((item) => item._id === action.payload._id);
      if (exist) return state;
      const updatedItems = [...state.wishlistItems, action.payload];
      localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
      return { wishlistItems: updatedItems };
    }
    case 'REMOVE_FROM_WISHLIST': {
      const updatedItems = state.wishlistItems.filter((item) => item._id !== action.payload);
      localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
      return { wishlistItems: updatedItems };
    }
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  return (
    <WishlistContext.Provider value={{ state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};

// frontend/src/context/CartContext.js
import React, { createContext, useReducer, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

export const CartContext = createContext();

const initialState = {
  cartItems: [],
};

const reducer = (state, action) => {
  let updatedItems;
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cartItems: action.payload };
    case 'ADD_ITEM': {
      const item = action.payload;
      const productId = String(item._id);
      const existItem = state.cartItems.find((x) => String(x.product) === productId);
      if (existItem) {
        updatedItems = state.cartItems.map((x) =>
          String(x.product) === productId ? { ...x, qty: x.qty + 1 } : x
        );
      } else {
        updatedItems = [...state.cartItems, { ...item, qty: 1, product: productId }];
      }
      return { ...state, cartItems: updatedItems };
    }
    case 'REMOVE_ITEM': {
      updatedItems = state.cartItems.filter(
        (item) => String(item.product) !== String(action.payload)
      );
      return { ...state, cartItems: updatedItems };
    }
    case 'UPDATE_QUANTITY': {
      const { product, qty } = action.payload;
      if (qty < 1) {
        updatedItems = state.cartItems.filter(
          (item) => String(item.product) !== String(product)
        );
      } else {
        updatedItems = state.cartItems.map((item) =>
          String(item.product) === String(product) ? { ...item, qty } : item
        );
      }
      return { ...state, cartItems: updatedItems };
    }
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;

  // Fetch the cart from the backend when the logged-in user changes.
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (userInfo) {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, config);
          const normalizedCart = data.cartItems.map((item) => ({
            ...item,
            product: String(item.product),
          }));
          dispatch({ type: 'SET_CART', payload: normalizedCart });
        } else {
          dispatch({ type: 'SET_CART', payload: [] });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [userInfo]);

  // Update the backend when the cart items change (debounced update)
  useEffect(() => {
    const timer = setTimeout(() => {
      const updateCart = async () => {
        try {
          const storedUser = JSON.parse(localStorage.getItem('userInfo'));
          if (!storedUser) return;
          const config = {
            headers: {
              Authorization: `Bearer ${storedUser.token}`,
              'Content-Type': 'application/json',
            },
          };
          await axios.post(`${process.env.REACT_APP_API_URL}/api/cart`, { cartItems: state.cartItems }, config);
        } catch (error) {
          console.error("Error updating cart on server:", error);
        }
      };
      updateCart();
    }, 1000);
    return () => clearTimeout(timer);
  }, [state.cartItems]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

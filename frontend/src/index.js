// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { WishlistProvider } from './context/WishlistContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { CustomThemeProvider } from './context/ThemeContext'; // Use the custom provider
import CssBaseline from '@mui/material/CssBaseline';
import './i18n';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SnackbarProvider 
    maxSnack={3}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    autoHideDuration={3000}
  >
    <CustomThemeProvider>
      <CssBaseline />
      <UserProvider>
        <ComparisonProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </ComparisonProvider>
      </UserProvider>
    </CustomThemeProvider>
  </SnackbarProvider>
);

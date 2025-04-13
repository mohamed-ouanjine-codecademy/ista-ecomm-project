// frontend/src/components/FloatingCartSummary.js
import React, { useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FloatingCartSummary = () => {
  const { t } = useTranslation();
  const { state } = useContext(CartContext);
  const { cartItems } = state;
  const navigate = useNavigate();

  // Calculate total quantity and total price
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // If there are no items, do not render the summary
  if (cartItems.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        backgroundColor: 'background.paper',
        boxShadow: 3,
        p: 2,
        borderRadius: 2,
        display: { xs: 'flex', md: 'none' }, // show only on mobile; adjust as needed
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1300, // high z-index to float on top of other elements
      }}
    >
      <Typography variant="subtitle1">
        {totalQuantity} {t('items')} - ${totalPrice.toFixed(2)}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/cart')}>
        {t('viewCart')}
      </Button>
    </Box>
  );
};

export default FloatingCartSummary;

// frontend/src/pages/CartPage.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Grid,
  IconButton,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const CartPage = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(CartContext);
  const { cartItems } = state;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const updateQuantity = (item, qty) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { product: item.product, qty } });
    enqueueSnackbar(t('cartUpdated'), { variant: 'info' });
  };

  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
    enqueueSnackbar(t('itemRemovedFromCart'), { variant: 'warning' });
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('yourCart')}
      </Typography>
      {cartItems.length === 0 ? (
        <Typography>
          {t('emptyCart')}. <RouterLink to="/">{t('goBackToShopping')}</RouterLink>
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {cartItems.map((item) => (
              <Grid item key={item.product} xs={12} sm={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: 2,
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.01)' },
                  }}
                >
                  <Box
                    component="img"
                    src={`${process.env.REACT_APP_API_URL}${item.image}`}
                    alt={item.name}
                    sx={{
                      width: { xs: '100%', sm: 100 },
                      height: 100,
                      borderRadius: 2,
                      objectFit: 'cover',
                    }}
                    loading="lazy"
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography>
                      {t('price')}: ${item.price.toFixed(2)}
                    </Typography>
                    <Typography>
                      {t('subtotal')}: ${(item.price * item.qty).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => updateQuantity(item, item.qty - 1)} color="primary">
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <Typography>{item.qty}</Typography>
                    <IconButton onClick={() => updateQuantity(item, item.qty + 1)} color="primary">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Box>
                  <IconButton onClick={() => removeItem(item.product)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6">
              {t('total')}: ${totalPrice.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/checkout')}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {t('proceedToCheckout')}
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default CartPage;

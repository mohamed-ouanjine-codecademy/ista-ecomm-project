// frontend/src/pages/OrderDetailPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Paper, Divider, CircularProgress } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, config);
        setOrder(data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
      setLoading(false);
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [id, userInfo]);

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (loading || !order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>{t('loadingOrderDetails')}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('orderDetails')}
      </Typography>
      <Paper sx={{ p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
        <Typography variant="h6">{t('orderId')}: {order._id}</Typography>
        <Typography variant="subtitle1">
          {t('placedOn')}: {new Date(order.createdAt).toLocaleString()}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">{t('shippingAddress')}</Typography>
        <Typography>
          {order.shippingAddress.address}, {order.shippingAddress.city}
        </Typography>
        <Typography>
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">{t('paymentMethod')}</Typography>
        <Typography>{order.paymentMethod}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">{t('orderItems')}</Typography>
        {order.orderItems.map((item, index) => (
          <Box key={index} sx={{ my: 1 }}>
            <Typography>
              {item.name} - {t('qty')}: {item.qty} - {t('price')}: ${item.price}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">{t('summary')}</Typography>
        <Box>
          <Typography>{t('itemsPrice')}: ${order.itemsPrice.toFixed(2)}</Typography>
          <Typography>{t('shippingPrice')}: ${order.shippingPrice.toFixed(2)}</Typography>
          <Typography>{t('taxPrice')}: ${order.taxPrice.toFixed(2)}</Typography>
          <Typography variant="h6">{t('total')}: ${order.totalPrice.toFixed(2)}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderDetailPage;

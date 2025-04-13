// frontend/src/pages/AdminOrderDetailPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Paper, Divider, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, config);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('orderDetails')}
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : !order ? (
        <Typography>{t('loadingOrderDetails')}</Typography>
      ) : (
        <Paper sx={{ p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
          <Typography variant="h6">{t('orderId')}: {order._id}</Typography>
          <Typography variant="subtitle1">{t('placedOn')}: {new Date(order.createdAt).toLocaleString()}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">{t('shippingAddress')}</Typography>
          <Typography>{order.shippingAddress.address}, {order.shippingAddress.city}</Typography>
          <Typography>{order.shippingAddress.postalCode}, {order.shippingAddress.country}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">{t('paymentMethod')}</Typography>
          <Typography>{order.paymentMethod}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">{t('orderItems')}</Typography>
          {order.orderItems.map((item) => (
            <Box key={item._id} sx={{ my: 1 }}>
              <Typography>{item.name} - {t('qty')}: {item.qty} - {t('price')}: ${item.price}</Typography>
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
          <Divider sx={{ my: 2 }} />
          <Button variant="contained" onClick={() => navigate('/admin/orderlist')}>
            {t('backToOrderList')}
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default AdminOrderDetailPage;

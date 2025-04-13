// frontend/src/pages/OrderHistoryPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Button,
  Divider
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot
} from '@mui/lab';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderHistoryPage = () => {
  const { t } = useTranslation();
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      // Ensure your backend endpoint returns the orders for the logged-in user.
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/myorders`, config);
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('orderHistory')}
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : orders.length === 0 ? (
        <Typography>{t('noOrdersFound')}</Typography>
      ) : (
        orders.map((order) => (
          <Paper
            key={order._id}
            sx={{
              p: 3,
              mb: 3,
              cursor: 'pointer',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.01)' }
            }}
            onClick={() => navigate(`/order/${order._id}`)}
          >
            <Typography variant="h6">
              {t('orderId')}: {order._id}
            </Typography>
            <Timeline position="right">
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  {t('placedOn')}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  {new Date(order.createdAt).toLocaleString()}
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  {t('paymentStatus')}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={order.isPaid ? 'success' : 'error'} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  {order.isPaid ? t('paid') : t('notPaid')}
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  {t('deliveryStatus')}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color={order.isDelivered ? 'success' : 'grey'} />
                </TimelineSeparator>
                <TimelineContent>
                  {order.isDelivered ? t('delivered') : t('notDelivered')}
                </TimelineContent>
              </TimelineItem>
            </Timeline>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h6">
                {t('total')}: ${order.totalPrice.toFixed(2)}
              </Typography>
              <Button variant="outlined" onClick={() => navigate(`/order/${order._id}`)} sx={{ mt: 1 }}>
                {t('viewDetails')}
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default OrderHistoryPage;

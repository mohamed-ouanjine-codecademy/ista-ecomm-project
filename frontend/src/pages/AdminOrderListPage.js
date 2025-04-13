// frontend/src/pages/AdminOrderListPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  TableContainer,
  Paper,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const AdminOrderListPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/orders`, config);
      setOrders(data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('fetchOrdersError'), { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deliverHandler = async (orderId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/orders/${orderId}/deliver`, {}, config);
      enqueueSnackbar(t('orderDelivered'), { variant: 'success' });
      fetchOrders();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('deliverError'), { variant: 'error' });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('adminOrderList')}
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto', my: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('orderId')}</TableCell>
                <TableCell>{t('user')}</TableCell>
                <TableCell>{t('total')}</TableCell>
                <TableCell>{t('delivered')}</TableCell>
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.user ? order.user.name : t('deletedUser')}</TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{order.isDelivered ? t('yes') : t('no')}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/admin/order/${order._id}`)}
                      >
                        {t('details')}
                      </Button>
                      {!order.isDelivered && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => deliverHandler(order._id)}
                        >
                          {t('markDelivered')}
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminOrderListPage;

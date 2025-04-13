// frontend/src/pages/AdminDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard`, config);
      setStats(data);
    } catch (err) {
      setError(err.response?.data.message || err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const chartData = [
    { name: t('totalOrders'), value: stats ? stats.totalOrders : 0 },
    { name: t('totalRevenue'), value: stats ? stats.totalRevenue : 0 },
    { name: t('totalProducts'), value: stats ? stats.totalProducts : 0 },
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('adminDashboard')}
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : stats ? (
        <>
          <Paper sx={{ p: 3, mb: 4, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
            <Typography variant="h6">{t('totalOrders')}: {stats.totalOrders}</Typography>
            <Typography variant="h6">{t('totalRevenue')}: ${stats.totalRevenue.toFixed(2)}</Typography>
            <Typography variant="h6">{t('totalProducts')}: {stats.totalProducts}</Typography>
          </Paper>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </>
      ) : null}
    </Container>
  );
};

export default AdminDashboardPage;

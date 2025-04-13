// frontend/src/pages/AddressBookPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const AddressBookPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/addresses`, config);
      setAddresses(data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('addressError'), { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/addresses`, formData, config);
      enqueueSnackbar(t('addressAdded'), { variant: 'success' });
      setFormData({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
      });
      fetchAddresses();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('addressError'), { variant: 'error' });
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm(t('confirmDeleteAddress'))) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/addresses/${id}`, config);
        enqueueSnackbar(t('addressRemoved'), { variant: 'info' });
        fetchAddresses();
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t('addressError'), { variant: 'error' });
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('addressBook')}
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
            <Typography variant="h6" gutterBottom>
              {t('addNewAddress')}
            </Typography>
            <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label={t('fullName')}
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <TextField
                label={t('address')}
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <TextField
                label={t('city')}
                fullWidth
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
              <TextField
                label={t('postalCode')}
                fullWidth
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                required
              />
              <TextField
                label={t('country')}
                fullWidth
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
              <TextField
                label={t('phone')}
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Button type="submit" variant="contained">
                {t('addAddress')}
              </Button>
            </Box>
          </Paper>

          <Typography variant="h5" gutterBottom>
            {t('myAddresses')}
          </Typography>
          {addresses.length === 0 ? (
            <Typography>{t('noAddresses')}</Typography>
          ) : (
            <Grid container spacing={2}>
              {addresses.map((addr) => (
                <Grid item xs={12} sm={6} md={4} key={addr._id}>
                  <Paper sx={{ p: 2, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
                    <Typography variant="subtitle1">{addr.fullName}</Typography>
                    <Typography>{addr.address}</Typography>
                    <Typography>
                      {addr.city}, {addr.postalCode}
                    </Typography>
                    <Typography>{addr.country}</Typography>
                    {addr.phone && <Typography>{addr.phone}</Typography>}
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteHandler(addr._id)}
                      sx={{ mt: 1 }}
                    >
                      {t('removeAddress')}
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default AddressBookPage;

// frontend/src/pages/AccountDashboard.js
import React, { useState, useContext } from 'react';
import { Container, Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext';
import OrderHistoryPage from './OrderHistoryPage';
import AddressBookPage from './AddressBookPage';
import WishlistPage from './WishlistPage';
import ProfilePage from './ProfilePage';

const AccountDashboard = () => {
  const { t } = useTranslation();
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('accountDashboard')}
      </Typography>
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={t('orderHistory')} />
          <Tab label={t('addressBook')} />
          <Tab label={t('wishlist')} />
          <Tab label={t('profileSettings')} />
        </Tabs>
      </Paper>
      <Box>
        {tabIndex === 0 && <OrderHistoryPage />}
        {tabIndex === 1 && <AddressBookPage />}
        {tabIndex === 2 && <WishlistPage />}
        {tabIndex === 3 && <ProfilePage />}
      </Box>
    </Container>
  );
};

export default AccountDashboard;

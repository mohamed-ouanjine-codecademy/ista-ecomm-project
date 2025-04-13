// frontend/src/pages/PaymentPage.js
import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Paper, Snackbar, Slide } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const PaymentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};

  const [cardNumber, setCardNumber] = useState('');
  const [expiration, setExpiration] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiration || !cvc) {
      setError(t('fillAllFields'));
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setSnackbarOpen(true);
      navigate(`/order/${orderData._id}`);
    }, 1500);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
        <Typography variant="h4" gutterBottom>
          {t('payment')}
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        <Box component="form" onSubmit={handlePayment} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('cardNumber')}
            fullWidth
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
          <TextField
            label={t('expirationDate')}
            fullWidth
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            required
          />
          <TextField
            label={t('cvc')}
            fullWidth
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={processing}>
            {processing ? t('processing') : t('payNow')}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={t('paymentSuccess')}
        autoHideDuration={3000}
        TransitionComponent={SlideTransition}
      />
    </Container>
  );
};

export default PaymentPage;

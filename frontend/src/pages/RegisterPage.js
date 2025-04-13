// frontend/src/pages/RegisterPage.js
import React, { useState, useContext } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Snackbar, Slide, Divider, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const RegisterPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        name,
        email,
        password,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch({ type: 'USER_LOGIN', payload: data });
      setSnackbarOpen(true);
      enqueueSnackbar(t('registrationSuccess'), { variant: 'success' });
      navigate('/');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/users/auth/google`;
  };

  return (
    <Container maxWidth="sm">
      <Paper
        sx={{
          mt: 4,
          p: 3,
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {t('register')}
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        </Box>
        <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('name')}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label={t('email')}
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label={t('password')}
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {t('register')}
          </Button>
        </Box>
        <Box sx={{ my: 2, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleLogin}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ height: 24, marginRight: 8 }}
            />
            {t('signInWithGoogle')}
          </Button>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            {t("alreadyHaveAccount")}?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              {t("loginHere")}
            </Link>
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={t('registrationSuccess')}
        autoHideDuration={3000}
        TransitionComponent={SlideTransition}
      />
    </Container>
  );
};

export default RegisterPage;

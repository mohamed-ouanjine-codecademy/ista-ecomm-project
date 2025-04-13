// frontend/src/pages/LoginPage.js
import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Slide,
  Divider,
  Link
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useContext(UserContext);

  // When redirected with token from Google OAuth
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      const fetchProfile = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/profile`, config);
          // Merge token into the user data so it’s available for later requests
          const userData = { ...data, token };
          localStorage.setItem('userInfo', JSON.stringify(userData));
          dispatch({ type: 'USER_LOGIN', payload: userData });
          enqueueSnackbar(t('loginSuccess'), { variant: 'success' });
          navigate('/');
        } catch (error) {
          console.error('Error fetching profile from token:', error);
          setError(
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message
          );
        }
      };
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, { email, password });
      // For email/password login, token is already part of the response data.
      localStorage.setItem('userInfo', JSON.stringify(data));
      dispatch({ type: 'USER_LOGIN', payload: data });
      setSnackbarOpen(true);
      enqueueSnackbar(t('loginSuccess'), { variant: 'success' });
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
            {t('login')}
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
        <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            {t('login')}
          </Button>
        </Box>
        <Box sx={{ my: 2, textAlign: 'center' }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            variant="outlined"
            color="secondary"
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
            {t("dontHaveAccount")}?{' '}
            <Link component={RouterLink} to="/register" underline="hover">
              {t("registerHere")}
            </Link>
          </Typography>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={t('loginSuccess')}
        autoHideDuration={3000}
        TransitionComponent={SlideTransition}
      />
    </Container>
  );
};

export default LoginPage;

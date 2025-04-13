// frontend/src/pages/ProfilePage.js
import React, { useState, useContext } from 'react';
import { Container, Typography, Box, TextField, Button, Avatar, Paper, Slide } from '@mui/material';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(UserContext);
  const { userInfo } = state;
  
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(userInfo?.avatar || '');
  const [message, setMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { name, email, password, avatar },
        config
      );
      dispatch({ type: 'USER_LOGIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setMessage(t('profileUpdated'));
      enqueueSnackbar(t('profileUpdated'), { variant: 'success' });
    } catch (error) {
      const errMsg = error.response && error.response.data.message ? error.response.data.message : error.message;
      setMessage(errMsg);
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/avatar`, formData, config);
      const cleanUrl = data.imageUrl.split('?')[0];
      setAvatar(cleanUrl);
      setUploadError('');
    } catch (error) {
      console.error('Avatar upload error:', error);
      setUploadError(t('avatarUploadError'));
      enqueueSnackbar(t('avatarUploadError'), { variant: 'error' });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('profile')}
      </Typography>
      <Paper sx={{ p: 3, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar
          src={`${process.env.REACT_APP_API_URL}${avatar}`}
          alt={name}
          sx={{ width: 100, height: 100 }}
        />
        <Button variant="outlined" component="label">
          {t('uploadAvatar')}
          <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
        </Button>
        {uploadError && (
          <Typography variant="body2" color="error">
            {uploadError}
          </Typography>
        )}
      </Paper>
      <Paper sx={{ p: 3, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
        <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label={t('fullName')}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label={t('email')}
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label={t('password')}
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {t('updateProfile')}
          </Button>
        </Box>
      </Paper>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button component={RouterLink} to="/account" variant="outlined">
          {t('accountDashboard')}
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;

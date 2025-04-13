// frontend/src/pages/AdminProductEditPage.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  useMediaQuery,
  Slide
} from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import LazyImage from '../components/LazyImage';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const AdminProductEditPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // For responsiveness: check if screen is small.
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`, config);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      enqueueSnackbar(t('fetchError'), { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id !== 'create') {
      fetchProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/uploads`, formData, config);
      const baseUrl = data.imageUrl.split('?')[0];
      setProduct({ ...product, image: baseUrl });
      enqueueSnackbar(t('imageUploaded'), { variant: 'success' });
    } catch (error) {
      console.error('Image upload error:', error);
      setError(error.response?.data?.message || error.message);
      enqueueSnackbar(t('imageUploadError'), { variant: 'error' });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/products/${id}`, product, config);
      enqueueSnackbar(t('productUpdated'), { variant: 'success' });
      navigate('/admin/productlist');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      enqueueSnackbar(t('updateError'), { variant: 'error' });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('editProduct')}
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      ) : (
        <Paper
          sx={{
            p: 3,
            transition: 'transform 0.3s',
            '&:hover': { transform: 'scale(1.02)' },
            width: isSmallScreen ? '100%' : '80%',
            mx: 'auto',
          }}
        >
          <Box
            component="form"
            onSubmit={submitHandler}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              label={t('name')}
              fullWidth
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
            />
            <TextField
              label={t('price')}
              type="number"
              fullWidth
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
              required
            />
            {product.image && (
              <Box sx={{ my: 2, textAlign: 'center' }}>
                <LazyImage
                  src={`${process.env.REACT_APP_API_URL}${product.image}`}
                  alt={product.name}
                  style={{ maxWidth: '100%', borderRadius: 4 }}
                />
              </Box>
            )}
            <input
              type="file"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={uploadFileHandler}
              accept="image/*"
            />
            <Button variant="outlined" onClick={() => fileInputRef.current.click()} sx={{ mb: 2 }}>
              {product.image ? t('changeImage') : t('uploadImage')}
            </Button>
            <TextField
              label={t('imageURL')}
              fullWidth
              value={product.image}
              onChange={(e) => setProduct({ ...product, image: e.target.value })}
              required
            />
            <TextField
              label={t('brand')}
              fullWidth
              value={product.brand}
              onChange={(e) => setProduct({ ...product, brand: e.target.value })}
              required
            />
            <TextField
              label={t('category')}
              fullWidth
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              required
            />
            <TextField
              label={t('countInStock')}
              type="number"
              fullWidth
              value={product.countInStock}
              onChange={(e) => setProduct({ ...product, countInStock: Number(e.target.value) })}
              required
            />
            <TextField
              label={t('description')}
              fullWidth
              multiline
              rows={4}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              {t('updateProduct')}
            </Button>
          </Box>
        </Paper>
      )}
      {/* Toast notification via notistack is used; no local Snackbar needed */}
    </Container>
  );
};

export default AdminProductEditPage;

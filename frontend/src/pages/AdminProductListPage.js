// frontend/src/pages/AdminProductListPage.js
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

const AdminProductListPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/products`, config);
      setProducts(data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('fetchProductsError'), { variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm(t('confirmDeleteProduct'))) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/products/${id}`, config);
        enqueueSnackbar(t('productDeleted'), { variant: 'success' });
        fetchProducts();
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t('deleteError'), { variant: 'error' });
      }
    }
  };

  const createHandler = async () => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/products`, {}, config);
      enqueueSnackbar(t('productCreated'), { variant: 'success' });
      navigate(`/admin/product/${data._id}/edit`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('createError'), { variant: 'error' });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('adminProductList')}
      </Typography>
      <Button variant="contained" color="primary" onClick={createHandler} sx={{ mb: 2 }}>
        {t('createProduct')}
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('id')}</TableCell>
                <TableCell>{t('image')}</TableCell>
                <TableCell>{t('name')}</TableCell>
                <TableCell>{t('price')}</TableCell>
                <TableCell>{t('category')}</TableCell>
                <TableCell>{t('brand')}</TableCell>
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product._id}</TableCell>
                  <TableCell>
                    <Box
                      component="img"
                      src={`${process.env.REACT_APP_API_URL}${product.image}`}
                      alt={product.name}
                      sx={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 1 }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                      >
                        {t('edit')}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteHandler(product._id)}
                      >
                        {t('delete')}
                      </Button>
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

export default AdminProductListPage;

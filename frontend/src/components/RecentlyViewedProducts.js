// frontend/src/components/RecentlyViewedProducts.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RecentlyViewedProducts = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    setProducts(recentlyViewed);
  }, []);

  if (products.length === 0) return null;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t('recentlyViewed')}
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardActionArea component={RouterLink} to={`/product/${product._id}`}>
                <CardMedia
                  component="img"
                  height="150"
                  image={`${process.env.REACT_APP_API_URL}${product.image}`}
                  alt={product.name}
                  loading="lazy"
                />
                <CardContent>
                  <Typography variant="subtitle1">{product.name}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default RecentlyViewedProducts;

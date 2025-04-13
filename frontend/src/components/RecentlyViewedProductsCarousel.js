// frontend/src/components/RecentlyViewedProductsCarousel.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Slider from 'react-slick';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const RecentlyViewedProductsCarousel = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Retrieve recently viewed products from localStorage
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    setProducts(recentlyViewed);
  }, []);

  if (!products || products.length === 0) return null;

  // Configure slider settings.
  const settings = {
    dots: false,
    infinite: products.length > 1, // Disable infinite if only one product
    speed: 500,
    slidesToShow: products.length > 1 ? Math.min(products.length, 4) : 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: products.length > 1 ? Math.min(products.length, 3) : 1,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: products.length > 1 ? Math.min(products.length, 2) : 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // If there's only one product, set a fixed maximum width and center the slide.
  const slideStyle = products.length === 1 ? { maxWidth: '300px', margin: '0 auto' } : {};

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t('recentlyViewed')}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Slider {...settings}>
          {products.map((product) => (
            <Box key={product._id} sx={{ px: 1, ...slideStyle }}>
              <RouterLink to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                <Box
                  component="img"
                  src={`${process.env.REACT_APP_API_URL}${product.image}`}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
                <Typography variant="subtitle1" align="center" sx={{ mt: 1 }}>
                  {product.name}
                </Typography>
              </RouterLink>
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>
  );
};

export default RecentlyViewedProductsCarousel;

// frontend/src/pages/ComparisonPage.js
import React, { useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import { ComparisonContext } from '../context/ComparisonContext';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ComparisonPage = () => {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useContext(ComparisonContext);
  const { comparisonItems } = state;

  const clearComparisonHandler = () => {
    dispatch({ type: 'CLEAR_COMPARISON' });
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Container sx={{ mt: 4, direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
        <Typography variant="h4" gutterBottom>
          {t('comparison')}
        </Typography>
        {comparisonItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1">{t('noComparison')}</Typography>
            <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
              {t('goShopping')}
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {comparisonItems.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                  >
                    <CardActionArea component={RouterLink} to={`/product/${product._id}`}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${process.env.REACT_APP_API_URL}${product.image}`}
                        alt={product.name}
                        loading="lazy"
                      />
                      <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body1">${product.price}</Typography>
                        <Typography variant="body2">
                          {t('rating')}: {product.rating ? product.rating.toFixed(1) : 'N/A'}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {/* New link to view detailed comparison */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button component={RouterLink} to="/comparison/details" variant="outlined">
                {t('viewDetailedComparison')}
              </Button>
            </Box>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button variant="contained" color="error" onClick={clearComparisonHandler}>
                {t('clearComparison')}
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ComparisonPage;

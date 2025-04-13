// frontend/src/pages/WishlistPage.js
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
import { Link as RouterLink } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const WishlistPage = () => {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useContext(WishlistContext);
  const { wishlistItems } = state;
  const { enqueueSnackbar } = useSnackbar();

  const removeFromWishlist = (id) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
    enqueueSnackbar(t('removedFromWishlist'), { variant: 'info' });
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <Container sx={{ py: 4, direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
        <Typography variant="h4" gutterBottom>
          {t('myWishlist')}
        </Typography>
        {wishlistItems.length === 0 ? (
          <Typography>{t('emptyWishlist')}</Typography>
        ) : (
          <Grid container spacing={4}>
            {wishlistItems.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <Card sx={{ transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
                  <CardActionArea component={RouterLink} to={`/product/${item._id}`}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${process.env.REACT_APP_API_URL}${item.image}`}
                      alt={item.name}
                      loading="lazy"
                    />
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography>${item.price}</Typography>
                    </CardContent>
                  </CardActionArea>
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Button variant="contained" color="secondary" onClick={() => removeFromWishlist(item._id)}>
                      {t('remove')}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default WishlistPage;

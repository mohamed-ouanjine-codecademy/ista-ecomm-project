// frontend/src/pages/ProductPage.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Rating,
  Grid,
  Slide,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import { WishlistContext } from '../context/WishlistContext';
import { ComparisonContext } from '../context/ComparisonContext';
import { useTranslation } from 'react-i18next';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { useSnackbar } from 'notistack';

// Social sharing imports from react-share
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from 'react-share';
import { FacebookIcon, WhatsappIcon, TwitterIcon } from 'react-share';
import InstagramIcon from '@mui/icons-material/Instagram';

// Import LazyLoadImage and its styles
import LazyImage from '../components/LazyImage';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const ProductPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [errorReview, setErrorReview] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { dispatch } = useContext(CartContext);
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const { state: wishlistState, dispatch: wishlistDispatch } = useContext(WishlistContext);
  const { state: comparisonState, dispatch: comparisonDispatch } = useContext(ComparisonContext);

  const isInWishlist = wishlistState.wishlistItems.find(item => item._id === product._id);
  const isInComparison = comparisonState.comparisonItems.find(item => item._id === product._id);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch product details and update "recently viewed" list
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
        setProduct(data);
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        const filtered = recentlyViewed.filter((p) => p._id !== data._id);
        const limited = [data, ...filtered].slice(0, 8);
        localStorage.setItem('recentlyViewed', JSON.stringify(limited));
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products based on category
  useEffect(() => {
    if (product && product.category) {
      const fetchRelatedProducts = async () => {
        try {
          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/products?category=${encodeURIComponent(
              product.category
            )}&pageSize=5`
          );
          const related = data.products.filter((p) => p._id !== product._id);
          setRelatedProducts(related);
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      };
      fetchRelatedProducts();
    }
  }, [product]);

  const addToCartHandler = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    enqueueSnackbar(t('productAddedToCart'), { variant: 'success' });
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (!review.rating || !review.comment) {
      setErrorReview(t('pleaseProvideReview'));
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/products/${id}/reviews`,
        review,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/${id}`);
      setProduct(data);
      setReview({ rating: 0, comment: '' });
      setErrorReview('');
      enqueueSnackbar(t('reviewSubmitted'), { variant: 'success' });
    } catch (error) {
      const errMsg =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      setErrorReview(errMsg);
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product._id });
      enqueueSnackbar(t('removedFromWishlist'), { variant: 'info' });
    } else {
      wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      enqueueSnackbar(t('addedToWishlist'), { variant: 'success' });
    }
  };

  const toggleComparison = () => {
    if (isInComparison) {
      comparisonDispatch({ type: 'REMOVE_FROM_COMPARISON', payload: product._id });
      enqueueSnackbar(t('removedFromComparison'), { variant: 'info' });
    } else {
      comparisonDispatch({ type: 'ADD_TO_COMPARISON', payload: product });
      enqueueSnackbar(t('addedToComparison'), { variant: 'success' });
    }
  };

  // Social Sharing: use current page URL as share URL
  const shareUrl = window.location.href;

  // Custom handler for Instagram sharing (copy URL to clipboard)
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      enqueueSnackbar(t('linkCopied'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(t('copyFailed'), { variant: 'error' });
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Zoom>
          <Box sx={{ width: '300px', borderRadius: 2, cursor: 'pointer' }}>
            <LazyImage
              alt={product.name}
              src={`${process.env.REACT_APP_API_URL}${product.image}`}
              width="300px"
              style={{ borderRadius: 8 }}
            />
          </Box>
        </Zoom>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">${product.price}</Typography>
          <Button variant="contained" onClick={addToCartHandler} sx={{ mb: 1 }}>
            {t('addToCart')}
          </Button>
          <IconButton onClick={toggleWishlist} color="secondary">
            {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton onClick={toggleComparison} color="primary">
            <CompareArrowsIcon />
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {isInComparison ? t('removeFromComparison') : t('addToCompare')}
            </Typography>
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">{t('reviews')}</Typography>
        {product.reviews && product.reviews.length === 0 && (
          <Typography>{t('noReviews')}</Typography>
        )}
        {product.reviews &&
          product.reviews.map((r) => (
            <Box key={r._id} sx={{ my: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="subtitle1">{r.name}</Typography>
              <Rating value={r.rating} readOnly />
              <Typography>{r.comment}</Typography>
            </Box>
          ))}
      </Box>
      {userInfo ? (
        <Box component="form" onSubmit={submitReviewHandler} sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h5" gutterBottom>
            {t('writeReview')}
          </Typography>
          {errorReview && <Typography color="error">{errorReview}</Typography>}
          <Rating
            name="rating"
            value={review.rating}
            onChange={(event, newValue) => setReview({ ...review, rating: newValue })}
          />
          <TextField
            label={t('comment')}
            fullWidth
            multiline
            rows={4}
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            {t('submitReview')}
          </Button>
        </Box>
      ) : (
        <Typography sx={{ mt: 4 }}>{t('pleaseLoginReview')}</Typography>
      )}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {t('relatedProducts')}
          </Typography>
          <Grid container spacing={2}>
            {relatedProducts.map((p) => (
              <Grid item key={p._id} xs={12} sm={6} md={3}>
                <Button
                  component={RouterLink}
                  to={`/product/${p._id}`}
                  sx={{ textTransform: 'none', p: 0 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <Box sx={{ width: '100%' }}>
                    <LazyImage
                      alt={p.name}
                      src={`${process.env.REACT_APP_API_URL}${p.image}`}
                      width="100%"
                      style={{ borderRadius: 8 }}
                    />
                  </Box>
                </Button>
                <Typography variant="subtitle1" align="center">
                  {p.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* Social Sharing Section */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {t('shareThisProduct')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <FacebookShareButton url={shareUrl} quote={product.name}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <WhatsappShareButton url={shareUrl} title={product.name}>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <TwitterShareButton url={shareUrl} title={product.name}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <IconButton onClick={handleCopyLink} color="primary">
            <InstagramIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductPage;

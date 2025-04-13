// frontend/src/pages/HomePage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Box,
  IconButton,
  CircularProgress,
  Button,
  Slide,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import AdvancedSearchFilters from '../components/AdvancedSearchFilters';
import RecentlyViewedProductsCarousel from '../components/RecentlyViewedProductsCarousel';
import { useTranslation } from 'react-i18next';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ComparisonContext } from '../context/ComparisonContext';
import { CartContext } from '../context/CartContext';
import QuickViewModal from '../components/QuickViewModal';
import { useSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroll-component';
// Import LazyLoadImage and its blur effect style
import LazyImage from '../components/LazyImage';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [filterParams, setFilterParams] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { state: comparisonState, dispatch: comparisonDispatch } = useContext(ComparisonContext);
  const { dispatch: cartDispatch } = useContext(CartContext);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const isXs = useMediaQuery((theme) => theme.breakpoints.down('xs'));

  const fetchProducts = async (pageNumber, filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.minRating !== undefined) queryParams.append('minRating', filters.minRating);
      if (filters.sort) queryParams.append('sort', filters.sort);
      queryParams.append('page', pageNumber);
      queryParams.append('pageSize', 10);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/products?${queryParams.toString()}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return { products: [], page: pageNumber, pages: 1, count: 0 };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialProducts = async () => {
      setPage(1);
      const data = await fetchProducts(1, filterParams);
      setProducts(data.products);
      setHasMore(data.page < data.pages);
    };
    loadInitialProducts();
  }, [filterParams]);

  const fetchMoreProducts = async () => {
    const nextPage = page + 1;
    const data = await fetchProducts(nextPage, filterParams);
    setProducts(prev => [...prev, ...data.products]);
    setPage(nextPage);
    if (nextPage >= data.pages) {
      setHasMore(false);
    }
  };

  const handleFilterChange = (filters) => {
    setFilterParams(filters);
  };

  const handleToggleComparison = (product) => {
    const exists = comparisonState.comparisonItems.some(item => item._id === product._id);
    if (exists) {
      comparisonDispatch({ type: 'REMOVE_FROM_COMPARISON', payload: product._id });
      enqueueSnackbar(t('removedFromComparison'), { variant: 'info' });
    } else {
      comparisonDispatch({ type: 'ADD_TO_COMPARISON', payload: product });
      enqueueSnackbar(t('addedToComparison'), { variant: 'success' });
    }
  };

  const isInComparison = (product) => {
    return comparisonState.comparisonItems.some(item => item._id === product._id);
  };

  const addToCartHandler = (product) => {
    cartDispatch({ type: 'ADD_ITEM', payload: product });
    enqueueSnackbar(t('productAddedToCart'), { variant: 'success' });
  };

  const handleOpenQuickView = (product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewOpen(false);
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <Container disableGutters sx={{ py: 4, direction: i18n.language === 'ar' ? 'rtl' : 'ltr', px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" gutterBottom>
          {t('latestProducts')}
        </Typography>
        <Button variant="outlined" onClick={() => setShowFilters(prev => !prev)} sx={{ mb: 2 }}>
          {showFilters ? t('hideFilters') : t('showFilters')}
        </Button>
        {showFilters && <AdvancedSearchFilters onFilterChange={handleFilterChange} />}
        {loading && products.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={fetchMoreProducts}
            hasMore={hasMore}
            loader={
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            }
            endMessage={
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                {t('noMoreProducts')}
              </Typography>
            }
            style={{ overflow: 'hidden' }}
          >
            <Grid container spacing={4} sx={{ overflowX: 'hidden' }}>
              {products.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4} sx={{ maxWidth: '100%' }}>
                  <Card
                    sx={{
                      transition: 'transform 0.3s',
                      overflow: 'hidden',
                      transformOrigin: 'center center',
                      zIndex: 0,
                      '&:hover': {
                        transform: 'scale(1.02)',
                        zIndex: 2,
                      },
                    }}
                  >
                    <CardActionArea component={RouterLink} to={`/product/${product._id}`}>
                      <Box sx={{ width: '100%' }}>
                        <LazyImage
                          src={`${process.env.REACT_APP_API_URL}${product.image}`}
                          alt={product.name}
                          width="100%"
                          style={{ height: '200px', objectFit: 'cover', borderRadius: 8 }}
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography gutterBottom variant="h6">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${product.price}
                        </Typography>
                      </Box>
                    </CardActionArea>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        py: 1,
                        px: 1,
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      <IconButton onClick={() => addToCartHandler(product)} color="primary" sx={{ flex: '1 1 auto' }}>
                        {t('addToCart')}
                      </IconButton>
                      <IconButton onClick={() => handleToggleComparison(product)} color="primary" sx={{ flex: '1 1 auto' }}>
                        <CompareArrowsIcon fontSize="small" />
                        <Typography variant="caption" sx={{ ml: 0.25, display: { xs: 'none', sm: 'block' } }}>
                          {isInComparison(product) ? t('removeFromComparison') : t('addToCompare')}
                        </Typography>
                      </IconButton>
                      <IconButton onClick={() => handleOpenQuickView(product)} color="primary" sx={{ flex: '1 1 auto' }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
        <QuickViewModal
          open={quickViewOpen}
          handleClose={handleCloseQuickView}
          product={selectedProduct}
          addToCart={addToCartHandler}
        />
        <RecentlyViewedProductsCarousel />
      </Container>
    </Box>
  );
};

export default HomePage;

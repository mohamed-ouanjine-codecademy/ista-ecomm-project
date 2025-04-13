// frontend/src/components/QuickViewModal.js
import React from 'react';
import { Modal, Box, Typography, Button, IconButton, Rating } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LazyImage from '../components/LazyImage';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '60%', md: '40%' },
  maxHeight: '90vh', // Limit the height so it doesn't overflow the viewport
  overflowY: 'auto', // Enable vertical scroll if content overflows
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const QuickViewModal = ({ open, handleClose, product, addToCart }) => {
  const { t } = useTranslation();
  if (!product) return null;

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="quick-view-modal">
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            {product.name}
          </Typography>
          <IconButton onClick={handleClose} aria-label={t('close')}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Product image with lazy loading */}
        <LazyImage
          src={`${process.env.REACT_APP_API_URL}${product.image}`}
          alt={product.name}
          style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
        />
        {/* Price and rating */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          ${product.price}
        </Typography>
        {product.rating && (
          <Rating value={product.rating} precision={0.5} readOnly sx={{ mb: 2 }} />
        )}
        {/* Description */}
        <Typography variant="body2" sx={{ mb: 3 }}>
          {product.description || t('noDescription')}
        </Typography>
        {/* Add to Cart Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            addToCart(product);
            handleClose();
          }}
          sx={{ mb: 1 }}
        >
          {t('addToCart')}
        </Button>
      </Box>
    </Modal>
  );
};

export default QuickViewModal;

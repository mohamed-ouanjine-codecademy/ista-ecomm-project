// frontend/src/pages/ComparisonDetailPage.js
import React, { useContext } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  Button,
  Box
} from '@mui/material';
import { ComparisonContext } from '../context/ComparisonContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ComparisonDetailPage = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(ComparisonContext);
  const { comparisonItems } = state;
  const navigate = useNavigate();

  if (comparisonItems.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">{t('noComparison')}</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          {t('goShopping')}
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('productComparison')}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('attribute')}</TableCell>
              {comparisonItems.map((item) => (
                <TableCell key={item._id} align="center">
                  {item.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Image Row */}
            <TableRow>
              <TableCell>{t('image')}</TableCell>
              {comparisonItems.map((item) => (
                <TableCell key={item._id} align="center">
                  <Box
                    component="img"
                    src={`${process.env.REACT_APP_API_URL}${item.image}`}
                    alt={item.name}
                    sx={{ maxWidth: '100px', borderRadius: 2 }}
                    loading="lazy"
                  />
                </TableCell>
              ))}
            </TableRow>
            {/* Price Row */}
            <TableRow>
              <TableCell>{t('price')}</TableCell>
              {comparisonItems.map((item) => (
                <TableCell key={item._id} align="center">
                  ${item.price.toFixed(2)}
                </TableCell>
              ))}
            </TableRow>
            {/* Brand Row */}
            <TableRow>
              <TableCell>{t('brand')}</TableCell>
              {comparisonItems.map((item) => (
                <TableCell key={item._id} align="center">
                  {item.brand}
                </TableCell>
              ))}
            </TableRow>
            {/* Category Row */}
            <TableRow>
              <TableCell>{t('category')}</TableCell>
              {comparisonItems.map((item) => (
                <TableCell key={item._id} align="center">
                  {item.category}
                </TableCell>
              ))}
            </TableRow>
            {/* Rating Row */}
            <TableRow>
              <TableCell>{t('rating')}</TableCell>
              {comparisonItems.map((item) => (
                <TableCell key={item._id} align="center">
                  {item.rating ? item.rating.toFixed(1) : 'N/A'}
                </TableCell>
              ))}
            </TableRow>
            {/* You can add additional rows for other attributes as needed */}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => dispatch({ type: 'CLEAR_COMPARISON' })}
        >
          {t('clearComparison')}
        </Button>
      </Box>
    </Container>
  );
};

export default ComparisonDetailPage;

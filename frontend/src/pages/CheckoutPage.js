// frontend/src/pages/CheckoutPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { state: userState } = useContext(UserContext);
  const { userInfo } = userState;
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { cartItems } = cartState;

  // Shipping address state for manual entry
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Payment method state: Only "Cash on Delivery" is enabled.
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Error message state
  const [error, setError] = useState('');

  // Saved addresses state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/addresses`, config);
        setSavedAddresses(data);
      } catch (error) {
        console.error(error);
        enqueueSnackbar(t('addressError'), { variant: 'error' });
      }
      setLoadingAddresses(false);
    };
    fetchAddresses();
  }, [userInfo.token, enqueueSnackbar, t]);

  const handleSavedAddressChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAddressId(selectedId);
    const addr = savedAddresses.find((a) => a._id === selectedId);
    if (addr) {
      setShippingAddress({
        address: addr.address,
        city: addr.city,
        postalCode: addr.postalCode,
        country: addr.country,
      });
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/coupons/${couponCode}`
      );
      setDiscount(data.discount);
      setCouponMessage(t('couponApplied', { discount: data.discount }));
    } catch (error) {
      setCouponMessage(t('couponInvalid'));
      setDiscount(0);
    }
  };

  // Price calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalBeforeDiscount = itemsPrice + shippingPrice + taxPrice;
  const discountAmount = (discount / 100) * totalBeforeDiscount;
  const finalTotalPrice = totalBeforeDiscount - discountAmount;

  const submitHandler = async (e) => {
    e.preventDefault();
    const orderItems = cartItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.product,
    }));

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const orderPayload = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice: finalTotalPrice,
        couponCode: couponCode ? couponCode.toUpperCase() : undefined,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        orderPayload,
        config
      );

      // Clear the cart upon order creation
      cartDispatch({ type: 'CLEAR_CART' });
      enqueueSnackbar(t('orderPlaced'), { variant: 'success' });
      // Since only "Cash on Delivery" is available, navigate directly.
      navigate(`/order/${data._id}`);
    } catch (error) {
      const errMsg =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      setError(errMsg);
      enqueueSnackbar(errMsg, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('checkout')}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={submitHandler}>
          <Typography variant="h6" gutterBottom>
            {t('shippingAddress')}
          </Typography>
          {loadingAddresses ? (
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : savedAddresses.length > 0 ? (
            <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('selectSavedAddress')}
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={selectedAddressId}
                  onChange={handleSavedAddressChange}
                >
                  {savedAddresses.map((addr) => (
                    <FormControlLabel
                      key={addr._id}
                      value={addr._id}
                      control={<Radio />}
                      label={`${addr.fullName} - ${addr.address}, ${addr.city}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>
          ) : null}
          <TextField
            label={t('address')}
            fullWidth
            margin="normal"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, address: e.target.value })
            }
            required
          />
          <TextField
            label={t('city')}
            fullWidth
            margin="normal"
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
            required
          />
          <TextField
            label={t('postalCode')}
            fullWidth
            margin="normal"
            value={shippingAddress.postalCode}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
            }
            required
          />
          <TextField
            label={t('country')}
            fullWidth
            margin="normal"
            value={shippingAddress.country}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, country: e.target.value })
            }
            required
          />

          {/* Payment Method: Only "Cash on Delivery" is active */}
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t('paymentMethod')}</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="Cash on Delivery"
                  control={<Radio />}
                  label={t('cashOnDelivery')}
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{t('haveCoupon')}</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label={t('couponCode')}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button variant="outlined" onClick={handleApplyCoupon}>
                {t('applyCoupon')}
              </Button>
            </Box>
            {couponMessage && (
              <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                {couponMessage}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1">
              {t('itemsPrice')}: ${itemsPrice.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              {t('shippingPrice')}: ${shippingPrice.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              {t('taxPrice')}: ${taxPrice.toFixed(2)}
            </Typography>
            {discount > 0 && (
              <Typography variant="body1" color="green">
                {t('discount')}: -${discountAmount.toFixed(2)} ({discount}%)
              </Typography>
            )}
            <Typography variant="h6">
              {t('total')}: ${finalTotalPrice.toFixed(2)}
            </Typography>
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {t('placeOrder')}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CheckoutPage;

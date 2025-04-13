// frontend/src/components/BackToTop.js
import React, { useContext } from 'react';
import { Zoom, Fab, useScrollTrigger, useMediaQuery, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CartContext } from '../context/CartContext';

const BackToTop = (props) => {
  const { window } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  // Check if there are items in the cart (i.e. FloatingCartSummary is rendered)
  const { state: cartState } = useContext(CartContext);
  const { cartItems } = cartState;
  const floatingCartVisible = cartItems.length > 0;

  // Only on mobile and if the floating cart is visible, set a higher bottom offset.
  const bottomOffset = isMobile && floatingCartVisible ? 100 : 16;
  // Set a higher z-index if needed on mobile when floating cart is visible.
  const zIndex = isMobile && floatingCartVisible ? 1400 : 1000;

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        style={{ position: 'fixed', bottom: bottomOffset, right: 16, zIndex: zIndex }}
      >
        <Fab color="primary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </div>
    </Zoom>
  );
};

export default BackToTop;

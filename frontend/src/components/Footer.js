// frontend/src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 2,
        mt: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © 2025 {t('appTitle')}
      </Typography>
    </Box>
  );
};

export default Footer;

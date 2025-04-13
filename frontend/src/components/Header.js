// frontend/src/components/Header.js
import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { state, dispatch } = useContext(UserContext);
  const { userInfo } = state;
  // Using our custom ThemeContext (with fallback provided in CustomThemeProvider)
  const { mode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Set the mobile drawer anchor based on language (Arabic on the right)
  const mobileDrawerAnchor = i18n.language === 'ar' ? 'right' : 'left';

  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAdminMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'USER_LOGOUT' });
  };

  const handleLanguageChange = (event) => {
    const selectedLang = event.target.value;
    setLanguage(selectedLang);
    i18n.changeLanguage(selectedLang);
    document.body.dir = selectedLang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleMobileDrawer = () => {
    setMobileOpen((prev) => !prev);
  };

  // Instead of multiple account-related links, we now show a single "Account" link.
  const accountLink = { label: t('account'), path: '/account' };

  // Other navigation items
  const navItems = userInfo
    ? [
        accountLink,
        { label: t('comparison'), path: '/comparison' },
        { label: t('cart'), path: '/cart' },
      ]
    : [
        { label: t('login'), path: '/login' },
        { label: t('register'), path: '/register' },
        { label: t('cart'), path: '/cart' },
      ];

  // Additional admin items (unchanged)
  const adminItems = [
    { label: t('adminDashboard'), path: '/admin/dashboard' },
    { label: t('productList'), path: '/admin/productlist' },
    { label: t('orderList'), path: '/admin/orderlist' },
  ];

  const drawerContent = (
    <Box onClick={toggleMobileDrawer} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        {t('appTitle')}
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Language selector */}
        <ListItem disablePadding>
          <ListItemButton>
            <FormControl fullWidth variant="standard">
              <InputLabel id="mobile-language-select-label">Lang</InputLabel>
              <Select
                labelId="mobile-language-select-label"
                value={language}
                onChange={handleLanguageChange}
                label="Lang"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="ar">العربية</MenuItem>
              </Select>
            </FormControl>
          </ListItemButton>
        </ListItem>
        {/* Dark mode toggle with dynamic text */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleTheme}>
            <ListItemText primary={mode === 'light' ? t('darkMode') : t('lightMode')} />
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </ListItemButton>
        </ListItem>
        {userInfo && userInfo.isAdmin && (
          <>
            <Divider />
            {adminItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton component={RouterLink} to={item.path}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
        {userInfo ? (
          <ListItem disablePadding>
            <ListItemButton onClick={logoutHandler}>
              <ListItemText primary={t('logout')} />
            </ListItemButton>
          </ListItem>
        ) : null}
      </List>
    </Box>
  );

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <AppBar position="sticky" sx={{ boxShadow: 3 }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {isMobile && i18n.language === 'ar' ? (
            <IconButton color="inherit" edge="end" onClick={toggleMobileDrawer} sx={{ ml: 2 }}>
              <MenuIcon />
            </IconButton>
          ) : (
            isMobile && (
              <IconButton color="inherit" edge="start" onClick={toggleMobileDrawer} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )
          )}
          {/* Title always flush left */}
          <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
            <Button component={RouterLink} to="/" color="inherit" sx={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              <Typography variant="h6" sx={{ textAlign: 'left' }}>
                {t('appTitle')}
              </Typography>
            </Button>
          </Box>
          {!isMobile && (
            <>
              <FormControl sx={{ mr: 2, minWidth: 120 }} size="small" variant="standard">
                <InputLabel id="language-select-label">Lang</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={language}
                  onChange={handleLanguageChange}
                  label="Lang"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="ar">العربية</MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 2 }}>
                {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
              {userInfo && (
                <>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    {userInfo.name}
                  </Typography>
                  <Button component={RouterLink} to="/account" color="inherit">
                    {t('account')}
                  </Button>
                  <Button component={RouterLink} to="/comparison" color="inherit">
                    {t('comparison')}
                  </Button>
                </>
              )}
              {userInfo && userInfo.isAdmin && (
                <>
                  <Tooltip title={t('adminPanel')} arrow>
                    <IconButton color="inherit" onClick={handleAdminMenuOpen}>
                      <DashboardIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleAdminMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem component={RouterLink} to="/admin/dashboard" onClick={handleAdminMenuClose}>
                      {t('adminDashboard')}
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/admin/productlist" onClick={handleAdminMenuClose}>
                      {t('productList')}
                    </MenuItem>
                    <MenuItem component={RouterLink} to="/admin/orderlist" onClick={handleAdminMenuClose}>
                      {t('orderList')}
                    </MenuItem>
                  </Menu>
                </>
              )}
              {userInfo ? (
                <Button onClick={logoutHandler} color="inherit">
                  {t('logout')}
                </Button>
              ) : (
                <>
                  <Button component={RouterLink} to="/login" color="inherit">
                    {t('login')}
                  </Button>
                  <Button component={RouterLink} to="/register" color="inherit">
                    {t('register')}
                  </Button>
                </>
              )}
              <Button component={RouterLink} to="/cart" color="inherit">
                {t('cart')}
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={mobileDrawerAnchor}
        open={mobileOpen}
        onClose={toggleMobileDrawer}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Header;

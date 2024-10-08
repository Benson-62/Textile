import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Box, Button, Toolbar, Typography, Icon } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const timerId = useRef(null); // Use useRef to store timer ID

  // Set timer to hide navbar after 5 seconds
  useEffect(() => {
    timerId.current = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timerId.current);
  }, []);

  // Show navbar on mouse movement and reset timer
  const handleMouseMove = () => {
    setVisible(true);
    clearTimeout(timerId.current); // Clear previous timer
    timerId.current = setTimeout(() => {
      setVisible(false);
    }, 5000); // Reset timer
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timerId.current); // Clear timer
    };
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        transition: 'height 0.5s ease-in-out, opacity 0.5s ease-in-out',
        height: visible ? '64px' : '0', // Change height for smooth transition
        overflow: 'hidden', // Prevent overflow when height is 0
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: 'black', transition: 'opacity 0.5s ease-in-out' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pandora
          </Typography>

          {/* Custom text icon */}
          <Icon sx={{ color: 'white', mr: 2 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>P</span>
          </Icon>

          <Button
            component={Link}
            to="/home"
            sx={{ textDecoration: 'none', color: 'white' }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'white' }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;

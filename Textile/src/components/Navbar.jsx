import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Box, Button, Toolbar, Typography, Icon } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState(null); // State to hold user data
  const timerId = useRef(null); // Use useRef to store timer ID
  const navigate = useNavigate();

  // Fetch user data from local storage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from local storage
    setUser(null); // Update state
    navigate('/'); // Redirect to login page
  };

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

          <Button component={Link} to="/home" sx={{ textDecoration: 'none', color: 'white' }}>
            Home
          </Button>
          
          {user ? ( // Check if user is logged in
            <>
              <Button
                component={Link}
                to="/u" // Route to user profile page
                sx={{ textDecoration: 'none', color: 'white' }}
              >
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                sx={{ textDecoration: 'none', color: 'white' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/"
              sx={{ textDecoration: 'none', color: 'white' }}
            >
              Login
            </Button>
          )}
          
          {/* Always visible Admin button */}
          <Button
            component={Link}
            to="/t"
            sx={{ textDecoration: 'none', color: 'white' }}
          >
            Admin
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;

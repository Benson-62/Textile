import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography, Icon } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: 'purple' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pandora
            </Typography>

            {/* Custom text icon */}
            <Icon style={{ color: 'white', marginRight: '20px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>P</span>
            </Icon>
            <Button>
              <Link to={'/home'} style={{ textDecoration: 'none', color: 'white' }}>
                Home
              </Link>
            </Button>
            <Button>
              <Link to={'/'} style={{ textDecoration: 'none', color: 'white' }}>
                Login
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Navbar;

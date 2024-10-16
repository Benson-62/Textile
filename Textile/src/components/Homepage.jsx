import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';  // Import Link

const HomePage = () => {
  const collections = [
    { name: 'Summer Collection', image: 'https://i.pinimg.com/736x/77/71/29/777129f51ff0492fdf4352166318737e.jpg', link: '/collections/summer' },
    { name: 'Autumn Collection', image: 'https://sfycdn.speedsize.com/c93e51c9-c4ee-4999-a19a-e064e9375152/https://www.percivalclo.com/cdn/shop/files/PERCIVAL_MENSWEAR__8_726fc17e-019e-4112-b342-ccb1e1a05b96.jpg?v=1723721396&width=1200', link: '/collections/autumn' },
    { name: 'Winter Collection', image: 'https://t3.ftcdn.net/jpg/01/91/72/42/360_F_191724216_CJMKL3xiH5tPoqYoU4RYFN3YITGHdSHg.jpg', link: '/collections/winter' },
    { name: 'Men\'s Fashion', image: 'https://img.freepik.com/premium-photo/three-men-wear-urban-fashion-clothes-they-are-situated_943281-25064.jpg', link: '/collections/men' },
    { name: 'Women\'s Fashion', image: 'https://wwd.com/wp-content/uploads/2021/03/IWD-Archival-15-2.jpg', link: '/collections/women' },
  ];

  return (
    <div className="home-background">
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Main Heading with Enhanced Styles */}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            marginBottom: 3,
            color: 'White',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)', // Adding text shadow
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Custom font
            transition: 'transform 0.5s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)', // Scale effect on hover
            },
          }}
        >
          Welcome to Pandora Textile
        </Typography>

        {/* Featured Collection */}
        <Typography variant="h5" component="h1" sx={{ marginBottom: 2, color: 'Black' }}>
          Discover Our Latest Collections
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {collections.map((collection, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  backgroundImage: `url(${collection.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: 300,
                  borderRadius: 2,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)', // Hover effect to scale the image
                  },
                }}
              >
                <Button
                  component={Link}  // Use Link component for navigation
                  to={collection.link}  // Navigate to the link
                  variant="contained"
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    textTransform: 'uppercase',
                  }}
                >
                  {collection.name}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default HomePage;

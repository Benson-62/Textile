import { Box } from '@mui/material';
import React from 'react';

const HomePage = () => {
  return (
    <div className='home-background'>
        <Box  sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
      <h1>Welcome to Pandora!</h1>
     </Box>
    </div>
  );
};

export default HomePage;

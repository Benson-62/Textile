import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const SummerCollection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch summer collection data from custom API
  const fetchSummerCollections = async () => {
    try {
      const response = await axios.get('/api/summer-collection'); // Your custom API endpoint
      if (Array.isArray(response.data)) {
        setCollections(response.data);
      } else {
        setCollections([]); // Fallback if the response is not an array
        setError('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching summer collections:', error);
      setError('Failed to load summer collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummerCollections();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Summer Dress Collection
      </Typography>

      {collections.length === 0 ? (
        <Typography>No collections available</Typography>
      ) : (
        <Grid container spacing={3}>
          {collections.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={item.imageUrl} // Assuming you have an image URL field in your API response
                  alt={item.name}
                />
                <CardContent>
                  <Typography variant="h5">{item.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: 1 }}>
                    ${item.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SummerCollection;

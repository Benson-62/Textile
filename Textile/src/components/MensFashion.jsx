import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import axios from 'axios';

const MensFashion = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', imageUrl: '', stock: '' });
  const [editItem, setEditItem] = useState(null);
  const [cart, setCart] = useState([]); // State for cart
  const [cartOpen, setCartOpen] = useState(true); // State to control cart visibility

  // Fetch men's fashion products
  const fetchMensFashion = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mens-fashion');
      setCollections(response.data);
    } catch (error) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMensFashion();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setNewProduct({ name: '', price: '', description: '', imageUrl: '', stock: '' });
  };

  const handleSaveProduct = async () => {
    try {
      if (editItem) {
        await axios.put(`http://localhost:5000/api/mens-fashion/${editItem.id}`, newProduct);
      } else {
        await axios.post('http://localhost:5000/api/mens-fashion', newProduct);
      }
      fetchMensFashion();
      handleClose();
    } catch (error) {
      setError('Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setEditItem(product);
    setNewProduct(product);
    handleClickOpen();
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/mens-fashion/${id}`);
      fetchMensFashion();
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    setCartOpen(true); // Open the cart when an item is added
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handleBuyNow = (product) => {
    alert(`You are purchasing: ${product.name} for $${product.price}`);
    // Add further buy functionality here (e.g., payment process)
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', padding: 4, position: 'relative' }}>
      {/* Products Section */}
      <Box sx={{ flex: 1, paddingRight: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Men's Fashion</Typography>
        <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ marginBottom: 2 }}>
          Add New Product
        </Button>

        <Grid container spacing={3}>
          {collections.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ marginTop: 1 }} color="text.primary">
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stock: {product.stock}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                  <Button size="small" onClick={() => handleEditProduct(product)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </Button>
                  <Button size="small" color="secondary" onClick={() => handleBuyNow(product)}>
                    Buy Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Cart Section on Right Side */}
      {cartOpen && (
        <Box sx={{
          position: 'fixed',
          right: 0,
          top: 64, // Adjusted to position just below the navbar
          height: 'calc(100vh - 64px)', // Reduced height of the cart
          width: '300px',
          backgroundColor: '#f8f8f8',
          boxShadow: '-2px 0px 5px rgba(0,0,0,0.1)',
          padding: 2,
          overflowY: 'auto',
        }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>Cart</Typography>
          <Button onClick={() => setCartOpen(false)} sx={{ marginBottom: 2 }} variant="outlined">Close Cart</Button>
          {cart.length === 0 ? (
            <Typography>No items in the cart</Typography>
          ) : (
            <>
              {cart.map((product, index) => (
                <Card key={index} sx={{ marginBottom: 2 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.imageUrl}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2">Price: ${product.price}</Typography>
                    <Typography variant="body2">Stock: {product.stock}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="secondary" onClick={() => handleBuyNow(product)}>
                      Buy
                    </Button>
                    <Button size="small" color="error" onClick={() => handleRemoveFromCart(index)}>
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </>
          )}
        </Box>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editItem ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Price"
            fullWidth
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Description"
            fullWidth
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Image URL"
            fullWidth
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Stock"
            fullWidth
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MensFashion;

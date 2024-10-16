import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Avatar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login if no user is logged in
    } else {
      setUser(loggedInUser); // Set user data
      setUpdatedUserData(loggedInUser); // Initialize the updated user data
    }
  }, [navigate]);

  const handleDeleteProfile = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/users/${user.id}`);
      if (response.status === 200) {
        localStorage.removeItem('user'); // Remove user from local storage
        setSnackbarMessage('Profile deleted successfully.');
        setOpenSnackbar(true);
        navigate('/'); // Redirect to login after deletion
      }
    } catch (error) {
      setSnackbarMessage('Failed to delete profile.');
      setOpenSnackbar(true);
    }
  };

  const handleEditProfile = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, updatedUserData);
      if (response.status === 200) {
        setUser(updatedUserData); // Update user state with new data
        localStorage.setItem('user', JSON.stringify(updatedUserData)); // Update local storage
        setSnackbarMessage('Profile updated successfully.');
        setOpenSnackbar(true);
        setEditDialogOpen(false); // Close dialog
      }
    } catch (error) {
      setSnackbarMessage('Failed to update profile.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
      }}
    >
      {user ? (
        <>
          <Avatar
            alt={user.name}
            src={user.image || 'https://via.placeholder.com/150'} // Placeholder image if none provided
            sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
          />
          <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
            {user.name}
          </Typography>
          <Typography variant="h6" sx={{ color: 'gray' }}>
            {user.email}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            Role: <strong>{user.role}</strong>
          </Typography>
          <Typography variant="body1">
            Phone: <strong>{user.phone || 'N/A'}</strong>
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Address: <strong>{user.address || 'N/A'}</strong>
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setEditDialogOpen(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteProfile}
            >
              Delete Profile
            </Button>
          </Box>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                name="name"
                value={updatedUserData.name}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                name="email"
                value={updatedUserData.email}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Phone"
                type="text"
                fullWidth
                name="phone"
                value={updatedUserData.phone || ''}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                label="Address"
                type="text"
                fullWidth
                name="address"
                value={updatedUserData.address || ''}
                onChange={handleInputChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEditProfile} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

        </>
      ) : (
        <Typography variant="body1">Loading user data...</Typography>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('Failed') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;

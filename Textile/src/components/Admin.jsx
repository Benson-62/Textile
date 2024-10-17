import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState(null);
  const [bills, setBills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Enable navigation

  // Check if the admin is logged in before displaying the page
  // useEffect(() => {
  //   const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));

  //   if (!isAdmin) {
  //     alert('Access denied. Admins only.');
  //     navigate('/admin-login'); // Redirect to the Admin Login page if not logged in
  //   }
  // }, [navigate]);

  // Fetching user details and bills
  const fetchUsersAndBills = async () => {
    try {
      const [userResponse, billsResponse] = await Promise.all([
        axios.get('/api/users'), // API endpoint for users
        axios.get('/api/bills'), // Corrected the endpoint for bills
      ]);

      setUsers(Array.isArray(userResponse.data) ? userResponse.data : []);
      setBills(Array.isArray(billsResponse.data) ? billsResponse.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndBills();

    const interval = setInterval(() => {
      fetchUsersAndBills();
    }, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewUserDetails = (userId) => {
    console.log('View details for user:', userId);
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');

    if (confirmDelete) {
      try {
        await axios.delete(`/api/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Users Section */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        User Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewUserDetails(user.id)}>View</Button>
                    <Button onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Bills Section */}
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        All Bills
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bill ID</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills && bills.length > 0 ? (
              bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.id}</TableCell>
                  <TableCell>{bill.userEmail}</TableCell>
                  <TableCell>{bill.amount}</TableCell>
                  <TableCell>{bill.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No bills found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminPage;

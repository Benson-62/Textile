import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Box, Button, Typography, TextField } from '@mui/material';

// Validation schema for admin login form
const AdminLoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
});

const AdminLoginPage = () => {
  const navigate = useNavigate();

  // Handle admin login form submission
  const handleAdminLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin-login', values);

      if (response.status === 200 && response.data.isAdmin) {
        localStorage.setItem('isAdmin', true); // Store admin status in localStorage
        navigate('/admin'); // Redirect to the admin page after successful login
      } else {
        setErrors({ submit: 'Invalid admin credentials. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Login error. Please check your credentials.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #1c92d2, #f2fcfe)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          borderRadius: 2,
          boxShadow: 5,
          backgroundColor: 'white',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: 2, textAlign: 'center', fontWeight: 'bold', color: '#1c92d2' }}
        >
          Admin Login
        </Typography>
        <Typography
          variant="body1"
          sx={{ marginBottom: 4, textAlign: 'center', color: '#555' }}
        >
          Please login with your admin credentials
        </Typography>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={AdminLoginSchema}
          onSubmit={handleAdminLogin}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <Box sx={{ marginBottom: 2 }}>
                <Field
                  name="email"
                  as={TextField}
                  label="Admin Email"
                  variant="outlined"
                  fullWidth
                  required
                  helperText={<ErrorMessage name="email" />}
                  error={Boolean(errors.email)}
                />
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Field
                  name="password"
                  as={TextField}
                  label="Admin Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  helperText={<ErrorMessage name="password" />}
                  error={Boolean(errors.password)}
                />
              </Box>

              {errors.submit && (
                <Typography color="error" sx={{ marginBottom: 2, textAlign: 'center' }}>
                  {errors.submit}
                </Typography>
              )}

              <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    width: '100%',
                    backgroundColor: '#1c92d2',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#145a86',
                    },
                  }}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
};

export default AdminLoginPage;

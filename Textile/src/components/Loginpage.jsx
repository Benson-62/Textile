import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Box, Button, Typography, TextField } from '@mui/material';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
});

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('/api/login', values);
      if (response.status === 200) {
        navigate('/home');
      } else {
        setErrors({ submit: 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Login error. Please check your credentials.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-background" style={{ 
      background: 'linear-gradient(to right, #8e44ad, #3498db)', // Gradient background
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          borderRadius: 2,
          boxShadow: 5,
          backgroundColor: 'white',
          transition: 'transform 0.2s', // Smooth transition effect
          '&:hover': {
            transform: 'scale(1.02)', // Slightly grow on hover
          }
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center', fontWeight: 'bold', color: '#8e44ad' }}>
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 4, textAlign: 'center', color: '#3498db' }}>
          Please login to your account
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <Box sx={{ marginBottom: 2 }}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  helperText={<ErrorMessage name="email" />}
                  error={Boolean(errors.email)}
                  sx={{ borderRadius: 1 }} // Rounded corners for input
                />
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Field
                  name="password"
                  as={TextField}
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  required
                  helperText={<ErrorMessage name="password" />}
                  error={Boolean(errors.password)}
                  sx={{ borderRadius: 1 }} // Rounded corners for input
                />
              </Box>

              {errors.submit && (
                <Typography color="error" sx={{ marginBottom: 2, textAlign: 'center' }}>
                  {errors.submit}
                </Typography>
              )}

              <Box
                sx={{
                  marginTop: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    width: '100%',
                    backgroundColor: '#3498db', // Button background color
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2980b9', // Darker on hover
                    },
                    borderRadius: 1, // Rounded corners for button
                    transition: 'background-color 0.3s', // Smooth transition for background color
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

export default LoginPage;

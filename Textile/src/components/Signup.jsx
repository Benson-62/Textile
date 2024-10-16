import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Box, Button, Typography, TextField } from '@mui/material';

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('Required'), // Add validation for name
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
});

const SignUpPage = () => {
  const handleSubmit = async (values) => {
    try {
      // Updated Axios call to point to your backend sign-up API
      const response = await axios.post('http://localhost:5000/api/signup', values);
      if (response.status === 201) {
        // Handle successful sign up
        alert("Sign up successful!"); // Simple success message, replace as needed
        window.location.reload(); // Refresh the page after successful signup
      }
    } catch (error) {
      // Handle error (e.g., show error message)
      alert("Sign up failed! Please try again."); // Simple error message, replace as needed
    }
  };

  return (
    <div
      className="signup-background"
      style={{
        background: 'linear-gradient(to right, #8e44ad, #3498db)', // Gradient background
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
          margin: 'auto',
          marginTop: '5%',
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, textAlign: 'center', fontWeight: 'bold' }}>
          Create Account
        </Typography>
        <Formik
          initialValues={{ name: '', email: '', password: '' }} // Include name in initial values
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <Box sx={{ marginBottom: 2 }}>
                <Field
                  name="name"
                  as={TextField}
                  label="Name"
                  variant="outlined"
                  fullWidth
                  required
                  helperText={<ErrorMessage name="name" />}
                />
              </Box>

              <Box sx={{ marginBottom: 2 }}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  required
                  helperText={<ErrorMessage name="email" />}
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
                />
              </Box>

              <Box sx={{
                  marginTop: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button type="submit" variant="contained" sx={{ width: '100%' }}>
                  Sign Up
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
};

export default SignUpPage;

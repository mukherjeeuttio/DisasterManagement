// RegistrationForm.js
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid2
} from '@mui/material';
import { theme } from '../theme'; 

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    phone: '',
    email: '',
    address: '',
    propertyType: '',
    propertyName: '',
    numberOfPeople: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., API call)
    console.log(formData);
  };

  return (
    <Grid2 
      container 
      justifyContent="center" 
      alignItems="center" 
      style={{ height: '100vh' }}
    >
      <Grid2 item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h2" align="center" gutterBottom>
            Registration Form
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                name="userName"
                label="User Name"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="phone"
                label="Phone"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                required
                type="email"
              />
              <TextField
                name="address"
                label="Address"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="propertyType"
                label="Property Type"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="propertyName"
                label="Property Name"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="numberOfPeople"
                label="Approx Number of People Living"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
              <Button
                variant="contained"
                type="submit"
                color="primary"
                style={{ marginTop: '20px' }}
              >
                Register
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid2>
    </Grid2>
  );
};

export default RegistrationForm;

import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Snackbar, 
  Alert 
} from '@mui/material'; 
import { styled } from '@mui/material/styles'; 

const StyledPaper = styled(Paper)({
  padding: '40px',
  borderRadius: '12px',
  backgroundColor: '#333',
  color: '#fff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
});

const StyledButton = styled(Button)({
  backgroundColor: '#007BFF',
  color: '#fff',
  fontWeight: 'bold',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

const StyledTypography = styled(Typography)({
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '20px',
  textAlign: 'center',
  color: '#fff',
});

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    propertyType: '',
    propertyName: '',
    noOfPeople: ''
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://f084-136-233-9-98.ngrok-free.app/register', formData)
      .then((response) => {
        if (response.status === 201) {
          setFormData({
            name: '',
            phone: '',
            email: '',
            address: '',
            propertyType: '',
            propertyName: '',
            noOfPeople: ''
          });
          setSnackbarMessage('User Registered Successfully');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage('Registration failed. Please try again.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        setSnackbarMessage('Error: ' + error.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Grid 
      container 
      justifyContent="center" 
      alignItems="center" 
      style={{ height: '100vh', backgroundColor: '#1c1c1c' }} 
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <StyledPaper>
          <StyledTypography>
            Registration Form
          </StyledTypography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                name="name"
                label="Name of Point of Contact"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                value={formData.name}
                required
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff', backgroundColor: '#444' } }}
              />
              <TextField
                name="phone"
                label="Phone"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                value={formData.phone}
                required
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff', backgroundColor: '#444' } }}
              />
              <TextField
                name="email"
                label="Email"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                value={formData.email}
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff', backgroundColor: '#444' } }}
              />
              <TextField
                name="address"
                label="Address"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                value={formData.address}
                required
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff', backgroundColor: '#444' } }}
              />
              <TextField
                name="propertyType"
                label="Property Type"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                value={formData.propertyType}
                required
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff', backgroundColor: '#444' } }}
              />
              <TextField
                name="propertyName"
                label="Property Name"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                value={formData.propertyName}
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff', backgroundColor: '#444' } }}
              />
              <TextField
                name="noOfPeople"
                label="Approx Number of People Living"
                variant="outlined"
                onChange={handleChange}
                fullWidth
                value={formData.noOfPeople}
                type="number"
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff', backgroundColor: '#444' } }}
              />
              <StyledButton
                variant="contained"
                type="submit"
                fullWidth
              >
                Register
              </StyledButton>
            </Box>
          </form>
        </StyledPaper>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default RegistrationForm;

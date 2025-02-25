import { Box, Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
    const { palette } = useTheme();

    return (
        <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
            <FlexBetween gap="0.75rem">
                <ContactEmergencyIcon sx={{ fontSize: "28px" }} />
                <Typography variant="h4" fontSize="16px">
                    Disaster Response
                </Typography>
            </FlexBetween>

            <FlexBetween gap="2rem">
                <Box 
                    component={Link} // Make the Box act as a Link
                    to="/" // Link to Dashboard
                    sx={{
                        "&:hover": { color: palette.primary[100] },
                        textDecoration: 'none', // Remove underline
                        color: palette.grey[300], // Default color
                    }}
                >
                    Dashboard
                </Box>
                <Box 
                    component={Link} // Make the Box act as a Link
                    to="/register" // Link to Registration Form
                    sx={{
                        "&:hover": { color: palette.primary[100] },
                        textDecoration: 'none', // Remove underline
                        color: palette.grey[300], // Default color
                    }}
                >
                    Register
                </Box>
            </FlexBetween>
        </FlexBetween>
    );
}

export default Navbar;

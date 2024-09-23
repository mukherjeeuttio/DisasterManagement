import { Box, Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

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
                <Box sx={{"&:hover": {color: palette.primary[100]}}}>Dashboard</Box>
            </FlexBetween>
        </FlexBetween>
    );
}

export default Navbar;
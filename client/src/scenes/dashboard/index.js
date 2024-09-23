import { Box, useMediaQuery} from '@mui/material';  
import Rec1 from "./Rec1";
import Rec2 from "./Rec2";
import Rec3 from "./Rec3";

const gridTemplateLargeScreens = ` 
        "a b"
        "a b"
        "a c"
        "a c"
    `;

const gridTemplateSmallScreens = ` 
        "b"
        "b"
        "a"
        "a"
        "a"
        "a"
        "c"
        "c"
    `;

const Dashboard = () => {
    const isAboveMd = useMediaQuery("(min-width: 1200px)"); 
    return (
        <Box width="100%" height="100%" display="grid" gap="1.5rem"
            sx={
                isAboveMd ? {
                gridTemplateColumns: "repeat(2, minmax(370px, 1fr))",
                gridTemplateRows: "repeat(4, minmax(60px, 1fr))",
                gridTemplateAreas: gridTemplateLargeScreens,
            } : {
                gridAutoColumns: "1fr",
                gridAutoRows: "80px",
                gridTemplateAreas: gridTemplateSmallScreens,
            }
        }
        >
          <Rec1 />
          <Rec2 />
          <Rec3 />
        </Box>
    )
}

export default Dashboard;
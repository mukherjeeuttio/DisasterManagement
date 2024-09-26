import { Box, useMediaQuery } from "@mui/material";  
import Rec1 from "./Rec1";
import Rec2 from "./Rec2";
import Rec3 from "./Rec3";
import { useState } from "react";

// Define grid templates for large and small screens
const gridTemplateLargeScreens = ` 
    "a b"
    "a b"
    "a c"
    "a c"
    "a c"
    "a c"
    "a c"
    "a c"
    "a c"
    "a c"
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
    const [selectedTask, setSelectedTask] = useState(null); // State for the selected task
    
    // Function to handle selection of a task from DataTable
    const handleTaskSelection = (task) => {
        setSelectedTask(task); // Update selected task
    };

    return (
        <Box 
            width="100%" 
            height="100%" 
            display="grid" 
            gap="1.5rem"
            sx={isAboveMd 
                ? { // Styles for larger screens
                    gridTemplateColumns: "repeat(2, minmax(370px, 1fr))",
                    gridTemplateRows: "repeat(4, minmax(60px, 1fr))",
                    gridTemplateAreas: gridTemplateLargeScreens,
                  } 
                : { // Styles for smaller screens
                    gridAutoColumns: "1fr",
                    gridAutoRows: "80px",
                    gridTemplateAreas: gridTemplateSmallScreens,
                  }
            }
        >
            {/* Rec1 for grid area 'a' */}
            <Rec1 onTaskSelect={handleTaskSelection} />
            {/* Rec2 for grid area 'b', showing transcribed information */}
            <Rec2 selectedTask={selectedTask} />
            <Rec3 />
        </Box>
    )
}

export default Dashboard;

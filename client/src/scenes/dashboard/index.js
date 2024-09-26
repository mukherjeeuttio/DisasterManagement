import { Box, useMediaQuery } from "@mui/material";  
import Rec1 from "./Rec1";
import Rec2 from "./Rec2";
import Rec3 from "./Rec3";
import { useState } from "react";

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

    const handleTaskSelection = (task) => {
        setSelectedTask(task);  // Set the selected task (includes address)
    };

    return (
        <Box 
            width="100%" 
            height="100%" 
            display="grid" 
            gap="1.5rem"
            sx={isAboveMd 
                ? { gridTemplateColumns: "repeat(2, minmax(370px, 1fr))", gridTemplateRows: "repeat(4, minmax(60px, 1fr))", gridTemplateAreas: gridTemplateLargeScreens } 
                : { gridAutoColumns: "1fr", gridAutoRows: "80px", gridTemplateAreas: gridTemplateSmallScreens }
            }
        >
            <Rec1 onTaskSelect={handleTaskSelection} selectedTask={selectedTask} />
            <Rec2 selectedTask={selectedTask} />
            <Rec3 selectedAddress={selectedTask ? selectedTask.address : ""} />
        </Box>
    );
};

export default Dashboard;

import DashBox from '../../components/DashBox';
import { Box } from '@mui/material'; 
import Rec1a from "./Rec1a";
import Rec1b from "./Rec1b";

const gridTemplate = ` 
  "d"
  "e"
  "e"
  "e"
  "e"
`;

const Rec1 = () => {
  return (
    <DashBox gridArea="a">        
      <Box
        width="100%"
        height="100%"
        display="grid"
        gap="1.5rem"
        sx={{
          gridTemplateColumns: "repeat(1, minmax(370px, 1fr))", 
          gridTemplateRows: "repeat(2, minmax(60px, 1fr))",    
          gridTemplateAreas: gridTemplate,                     
        }}
      >
        <Rec1a />
        <Rec1b />
      </Box>
    </DashBox>
  );
};

export default Rec1;

import DashBox from '../../components/DashBox';
// import { Box } from '@mui/material'; 
import DataTable from '../../components/DataTable';
import LiveTranscription from '../../components/Transcriber';

const Rec1 = () => {
  return (
    <DashBox gridArea="a">        
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "0 0 25%", marginBottom: "0rem" }}>
          <LiveTranscription />
        </div>
        <div style={{ flex: "0 0 75%", marginTop: "0rem" }}>
          <DataTable />
        </div>
      </div>
    </DashBox>
  );
};

export default Rec1;

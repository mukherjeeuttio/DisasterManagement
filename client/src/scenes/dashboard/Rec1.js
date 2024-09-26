import DashBox from '../../components/DashBox';
import DataTable from '../../components/DataTable';
import LiveTranscription from '../../components/Transcriber';

const Rec1 = ({ onTaskSelect }) => {

  return (
    <DashBox gridArea="a">        
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "0 0 25%", marginBottom: "0rem" }}>
          <LiveTranscription />
        </div>
        <div style={{ flex: "0 0 75%", marginTop: "0rem" }}>
          <DataTable onRowClick={onTaskSelect} />  {/* Pass the handler */}
        </div>
      </div>
    </DashBox>
  );
};

export default Rec1;

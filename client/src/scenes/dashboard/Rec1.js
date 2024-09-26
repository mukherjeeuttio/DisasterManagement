import DashBox from '../../components/DashBox';
import DataTable from '../../components/DataTable';
import LiveTranscription from '../../components/Transcriber';

const Rec1 = ({ onTaskSelect, selectedTask }) => {
  return (
    <DashBox gridArea="a" >
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: "0 0 25%",marginTop: "0", padding: "0.25rem"}}>
          <LiveTranscription selectedTranscription={selectedTask?.transcription} />
        </div>
        <div style={{ flex: "0 0 75%", marginTop: "0rem" }}>
          <DataTable onRowClick={onTaskSelect} />
        </div>
      </div>
    </DashBox>
  );
};

export default Rec1;

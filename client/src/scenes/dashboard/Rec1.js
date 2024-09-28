import React from 'react';
import DashBox from '../../components/DashBox';
import DataTable from '../../components/DataTable';
import LiveTranscription from '../../components/Transcriber';
import TranslatedText from '../../components/TranslatedText';  // Import TranslatedText component
import { Divider } from '@mui/material';  // Import Divider from MUI

const Rec1 = ({ onTaskSelect, selectedTask }) => {
  return (
    <DashBox gridArea="a" >
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        
        <div style={{ flex: "0 0 5%", marginTop: "0", padding: "0.1rem" }}>
          <LiveTranscription selectedTranscription={selectedTask?.transcribed_text} />
        </div>

        {/* Divider to separate Transcription and Translation sections */}
        <Divider sx={{ backgroundColor: '#12efc8', margin: '0' }} />

        <div style={{ flex: "0 0 5%", marginTop: "0", padding: "0.1rem" }}>
          <TranslatedText translatedText={selectedTask?.translated_text} /> 
        </div>

        <div style={{ flex: "0 0 50%", marginTop: "0rem" }}>
          <DataTable onRowClick={onTaskSelect} />
        </div>

      </div>
    </DashBox>
  );
};

export default Rec1;

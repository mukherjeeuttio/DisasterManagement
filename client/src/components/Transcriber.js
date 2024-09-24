import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LiveTranscription = () => {
  const theme = useTheme();
  const [displayedText, setDisplayedText] = useState('');

  // Sample predefined transcriptions for testing
  const testTranscriptions = [
    "Hello, this is a test transcription.",
    "We are testing the live transcription feature.",
    "The quick brown fox jumps over the lazy dog.",
    "React is a great library for building UIs.",
    "This will simulate live speech-to-text transcription."
  ];

  useEffect(() => {
    // Combine the test transcriptions into a single string
    setDisplayedText(testTranscriptions.join(' '));
  }, []);

  return (
    <Box sx={{
      padding: '1rem',
      backgroundColor: theme.palette.background.light,
      borderRadius: '8px',
      maxHeight: '300px',
      overflowY: 'auto',
    }}>
      <Typography variant="h3" sx={{ marginBottom: '1rem', color: theme.palette.text.primary }}>
        Live Transcription:
      </Typography>
      <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
        {displayedText}
      </Typography>
    </Box>
  );
};

export default LiveTranscription;




// import React, { useState, useEffect } from 'react';

// const LiveTranscription = ({ transcriptions }) => {
//   const [displayedText, setDisplayedText] = useState('');

//   useEffect(() => {
//     setDisplayedText(transcriptions.join(' '));
//   }, [transcriptions]);

//   return (
//     <div style={{
//       padding: '1rem',
//       border: '1px solid #ccc',
//       borderRadius: '8px',
//       backgroundColor: '#f9f9f9',
//       maxHeight: '300px',
//       overflowY: 'auto'
//     }}>
//       <h3>Live Transcription:</h3>
//       <p>{displayedText}</p>
//     </div>
//   );
// };

// export default LiveTranscription;

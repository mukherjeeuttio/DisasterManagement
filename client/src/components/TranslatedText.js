import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TranslatedText = ({ translatedText }) => {
  const theme = useTheme();

  return (
    <Box sx={{
      paddingTop: '0',
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingBottom: "1rem",
      backgroundColor: theme.palette.background.light,
      borderRadius: '8px',
      marginBottom: '0.5rem',
      maxHeight: '160px',
      overflowY: 'auto',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
      position: 'relative'  // Ensure z-index is respected
    }}>
      <Typography 
        variant="h3" 
        sx={{ 
          marginBottom: '1rem',
          color: '#12efc8', 
          position: 'sticky',  // Keep the heading fixed while scrolling
          top: 0,              // Stick to the top of the container
          backgroundColor: theme.palette.background.light, // Maintain background color behind sticky 
          zIndex: 2,           // Ensure it stays above scrolling content
          padding: '0.5rem',   // Add padding around the heading
        }}
      >
        Translated Text:
      </Typography>
      <Box sx={{ zIndex: 1, position: 'relative' }}>
        <Typography variant="body1" sx={{ color: 'white' }}>
          {translatedText || "Select a task to view translated text."}
        </Typography>
      </Box>
    </Box>
  );
};

export default TranslatedText;

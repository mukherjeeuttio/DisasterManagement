import { useMemo } from "react";
import { createTheme, ThemeProvider, CssBaseline, Box } from "@mui/material"; 
import { themeSettings } from "./theme";
import { Routes, Route, BrowserRouter } from "react-router-dom"; 
import Navbar from "./scenes/navbar";
import Dashboard from "./scenes/dashboard";
import RegistrationForm from "./components/RegistrationForm"; // Import the RegistrationForm component

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<RegistrationForm />} /> {/* Add this route */}
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

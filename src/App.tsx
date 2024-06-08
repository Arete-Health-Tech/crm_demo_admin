import { createTheme, PaletteMode, ThemeProvider } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Toast from './components/Toast';
import AppContainer from './container/AppContainer';
import { getDesignTokens } from './styles/theme';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
      }
    }),
    []
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AppContainer />
          <Toast />
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

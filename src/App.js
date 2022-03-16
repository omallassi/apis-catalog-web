import React from 'react';
import './App.css';
import Dashboard from './Dashboard';

//import { createTheme, ThemeProvider } from '@mui/material/styles';
//import { BrowserRouter } from 'react-router-dom'

function App(props) {
  //const classes = useStyles(props);

  return (
    // <ThemeProvider theme={theme}>
      <div>
        {/* <AppRouter/> */}
        <Dashboard/>
      </div>
    // </ThemeProvider>
  );
}

export default App;
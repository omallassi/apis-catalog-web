import React from 'react';
import './App.css';
import AppRouter from "./component/RouterComponent";
import Container from '@material-ui/core/Container';
import Dashboard from './Dashboard';

import DashboardComponent from './component/DashboardComponent';

//import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <div>
      {/* <AppRouter/> */}
      <Dashboard/>
    </div>
  );
}

export default App;
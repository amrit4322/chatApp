import React, { useEffect } from 'react';
import Routes from './routes';

//Import Scss
import "./assets/scss/themes.scss";
import { socket } from './helpers/socket';
import { useSelector } from 'react-redux';

//fackbackend


function App() {
  
  return <Routes />;
};

export default App;

import React, { useEffect } from 'react';
import Routes from './routes';

//Import Scss
import "./assets/scss/themes.scss";
import { socket } from './helpers/socket';
import { useSelector } from 'react-redux';

//fackbackend


function App() {
  useEffect(()=>{
  
    socket.on("welcome", (data) => console.log("aaaaaaaaaa" ,data))
  }, [])
  return <Routes />;
};

export default App;

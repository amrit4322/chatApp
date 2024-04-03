import React, { useEffect } from 'react';
import Routes from './routes';

//Import Scss
import "./assets/scss/themes.scss";
import { socket } from './helpers/socket';
import { useSelector } from 'react-redux';

//fackbackend


function App() {
  const data  = useSelector((state)=>state.user.user)
  useEffect(()=>{
    if(data?.id){
    socket.emit("login",data?.id)
    }
    return ()=>{
      socket.off("login",data?.id)
    }
  })
  return <Routes />;
};

export default App;

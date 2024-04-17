import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//carousel
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";


import { socket } from "../../../helpers/socket";
import OnlineUserItem from "../../../components/onlineUserItem";
import { useSelector } from "react-redux";

const OnlineUsers = () => {
  const responsive = {
    0: { items: 4 },
    1024: { items: 4 },
  };
  const [onlineUser,setOnlineUsers] = useState(null);
  const userID = useSelector((state)=>state.user.user)
  const connectedUsers = useSelector((state)=>state.user.connectedUsers)
  
  useEffect(()=>{
    function broadCastOnline(data){
      const connectedUserIds = connectedUsers.map(user => user.id);
      const filteredData = data.filter(user => connectedUserIds.includes(user));
      setOnlineUsers(filteredData)
    }
    socket.on("userStatusUpdate", broadCastOnline)
    return()=>{
      socket.off("userStatusUpdate",broadCastOnline)
    }
  },[])

  return (
    <React.Fragment>
      {/* Start user status */}
      {onlineUser &&
      <div className="px-4 pb-4 dot_remove" dir="ltr">
        <AliceCarousel
          responsive={responsive}
          disableDotsControls={false}
          disableButtonsControls={false}
          mouseTracking
        >
          {onlineUser?.map((a)=>(
          <OnlineUserItem key={a} id={a} />
       
          )
          )}

        </AliceCarousel>
        {/* end user status carousel */}
      </div>
      }
      {/* end user status  */}
    </React.Fragment>
  );
};

export default OnlineUsers;

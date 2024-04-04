import React, { useEffect } from "react";
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect, useDispatch, useSelector } from "react-redux";
import API from "../../helpers/api";
import { socket } from "../../helpers/socket";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userAccepted, userNotification, userUpdateContacts } from "../../redux/slice.auth";

const Index = ({ userOnline }) => {
  const inviteAccepted = useSelector((state) => state.user.inviteAccepted);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.user.notification);
  const data  = useSelector((state)=>state.user.user)

  const setToast = (type, data) => {
    toast[type](
      <div>
        <p>Message : {data}</p>
      </div>,
      {
        position: "bottom-right",
        closeOnClick: true,
        theme: "colored",
        transition: Bounce,
        autoClose: 5000,
        pauseOnHover: false,
      }
    );
  };

  useEffect(() => {

    if(data?.id){
      console.log("emmitting loginnnnnnnnnnnnn")
      socket.emit("login",data.id)
      }
     

    socket.on("inviteNotifcation",(data)=>{
      setToast("success", data);
      dispatch(
        userNotification({
          notification: notification + 1,
        })
      );

    })



    socket.on("removeNotification", (data) => {
      console.log("notification",data)
      dispatch(
        userNotification({
          notification: notification + 1,
        })
      );
      dispatch(
        userUpdateContacts({
          updateContacts:true
         })
      )
      setTimeout(()=>{
        dispatch(userUpdateContacts({
          updateContacts:false,
        }))
      },1000)
      setToast("info", data);
    });
    socket.on("notificationAccepted", (data) => {
      console.log("notification",data)

      console.log("notifcation", data);
      dispatch(
        userAccepted({
          inviteAccepted:
            inviteAccepted?.length > 0 ? [...inviteAccepted, data] : [data],
        })
      );
      setToast("success", data);
    });
    return () => {
      socket.off("notificationAccepted");
      socket.off("removeNotification");
      socket.off("login")
    };
  }, [dispatch, inviteAccepted]);
  console.log("users ssssss", userOnline);
  return (
    <React.Fragment>
      {/* chat left sidebar */}
      <ChatLeftSidebar recentChatList={userOnline} />

      {/* user chat */}
      <UserChat recentChatList={userOnline} />
      <ToastContainer />
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { userOnline } = state.user;
  return { userOnline };
};

export default connect(mapStateToProps, {})(Index);

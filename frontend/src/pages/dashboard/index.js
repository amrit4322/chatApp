import React, { useEffect, useState } from "react";
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect, useDispatch, useSelector } from "react-redux";
import API from "../../helpers/api";
import { socket } from "../../helpers/socket";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  userAccepted,
  userConnectedVideo,
  userNotification,
  userUpdateContacts,
  userUpdateInvites,
} from "../../redux/slice.auth";
import VideoCallModal from "../../components/VideoCall";
import AudioCallModal from "../../components/AudioCall";

const Index = ({ userOnline, activeChat }) => {
  const inviteAccepted = useSelector((state) => state.user.inviteAccepted);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.user.notification);
  const connectedUsers = useSelector((state) => state.user.connectedUsers);
  const connectedAudio = useSelector((state) => state.user.connectedAudio);
  const connectedVideo = useSelector((state) => state.user.connectedVideo);
  const [incomingVideo, setIncomingVideo] = useState(null);
  const [incomingAudio, setIncomingAudio] = useState(null);
  console.log("orrrrrrrrrrrrrr", connectedUsers);
  const [acceptedVideo, setIsAcceptedVideo] = useState(false);
  const [acceptedAudio, setIsAcceptedAudio] = useState(false);
  const [audioCall, setIsAudioCall] = useState(false);
  // const filteredUsers = connectedUsers.filter(user => user.id === id);
  const user = useSelector((state) => state.user.user);
  const [offer,setOffer] = useState(null)
  
  const setToast = (type, data) => {
    console.log("setToast cALLLLLED");
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
   
    

    socket.on("user_connect_request_video", (data,offer) => {
      console.log("connnnnnnnnnnnnnnn", incomingVideo, data);
      const filteredUsers = connectedUsers.filter((user) => user.id === data);
      setOffer(offer)
      setIncomingVideo(filteredUsers);
    });
    socket.on("user_connect_request_audio", (data,offer) => {

      console.log("audioooooooo", incomingAudio, data,offer);
      const filteredUsers = connectedUsers.filter((user) => user.id === data);
      console.log("filereeee",filteredUsers)
      setOffer(offer)
      setIncomingAudio(filteredUsers);
    });
    return () => {
      socket.off("user_connect_request_video");
      socket.off("user_connect_request_audio");
    };
  }, [incomingVideo, incomingAudio, acceptedVideo]);

  useEffect(()=>{
    if(connectedVideo){
      const filteredUsers = connectedUsers.filter((user) => user.id === activeChat?.id);
      console.log("connecteddddd ",filteredUsers)
      setIsAcceptedVideo(true);
      setIncomingVideo(filteredUsers);
    }
    
    if(connectedAudio){
      const filteredUsers = connectedUsers.filter((user) => user.id === activeChat?.id);
      console.log("connecteddddd Audioo",filteredUsers)
      setIsAcceptedAudio(true);
      setIncomingAudio(filteredUsers);
    }
  },[connectedVideo,connectedAudio])
  useEffect(() => {
    socket.on("inviteNotification", (data) => {
      setToast("success", data);
      console.log("notified");
      dispatch(
        userNotification({
          notification: notification + 1,
        })
      );

      dispatch(
        userUpdateInvites({
          updateInvites: true,
        })
      );
      setTimeout(() => {
        dispatch(
          userUpdateInvites({
            updateInvites: false,
          })
        );
      }, 1000);
    });
    return () => {
      socket.off("inviteNotification");
    };
  }, []);
  useEffect(() => {
    if (user?.id) {
      console.log("emmitting loginnnnnnnnnnnnn");
      socket.emit("login", user.id);
    }

    socket.on("removeNotification", (data) => {
      console.log("notification", data);

      dispatch(
        userUpdateContacts({
          updateContacts: true,
        })
      );
      setTimeout(() => {
        dispatch(
          userUpdateContacts({
            updateContacts: false,
          })
        );
      }, 1000);
      setToast("info", data);
    });
    socket.on("notificationAccepted", (data) => {
      console.log("notification", data);

      dispatch(
        userNotification({
          notification: notification + 1,
        })
      );
      // if (!inviteAccepted.some(invite => invite.id === data.id)) {
      // If not, dispatch the action with the new invite added to the filtered array
      console.log("inviteAccepted?.length > 0", inviteAccepted?.length);
      dispatch(
        userAccepted({
          inviteAccepted:
            inviteAccepted?.length > 0 ? [...inviteAccepted, data] : [data],
        })
      );
      // }

      setToast("success", data);
    });
    return () => {
      socket.off("notificationAccepted");
      socket.off("removeNotification");
      socket.off("login");
    };
  }, [inviteAccepted]);

  return (
    <React.Fragment>
      {/* chat left sidebar */}
      <ChatLeftSidebar recentChatList={userOnline} />
      <ToastContainer />
      {incomingVideo?.length > 0  && (
        <VideoCallModal 
          isOpen={incomingVideo?.length > 0}
          userConnTo={incomingVideo[0]}
          setValue={setIncomingVideo}
          IsAccepted={acceptedVideo}
          setAccept={setIsAcceptedVideo}
          isConnected = {connectedVideo}
          offerAvail= {offer}

        />
      )}
      {incomingAudio?.length > 0 &&
        <AudioCallModal
          isOpen={true}
          userConnTo={incomingAudio[0]}
          setValue={setIncomingAudio}
          IsAccepted={acceptedAudio}
          setAccept={setIsAcceptedAudio}
          isConnected = {connectedAudio}
          offerAvail= {offer}
        />
       }

      {/* user chat */}
      {activeChat ? (
        <UserChat recentChatList={userOnline} />
      ) : (
        <div className="d-flex w-100 justify-content-center align-items-center bg-red color-red">
          Nothing to show
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  const { userOnline, activeChat} = state.user;
  return { userOnline, activeChat };
};

export default connect(mapStateToProps, {})(Index);

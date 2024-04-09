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
  const [incomingVideo, setIncomingVideo] = useState(null);
  const [incomingAudio, setIncomingAudio] = useState(null);
  console.log("orrrrrrrrrrrrrr", connectedUsers);
  const [accepted, setIsAccepted] = useState(false);
  const [audioCall, setIsAudioCall] = useState(false);
  // const filteredUsers = connectedUsers.filter(user => user.id === id);
  const user = useSelector((state) => state.user.user);

  const onAudioStream = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", function (event) {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", function () {
          const audioBlob = new Blob(audioChunks);
          const fileReader = new FileReader();
          fileReader.readAsDataURL(audioBlob);

          fileReader.onloadend = function () {
            const base64String = fileReader.result;
            socket.emit("audio_stream", user.id, base64String);
          };
        });
        setIsAudioCall(true);
        mediaRecorder.start();
        setTimeout(function () {
          mediaRecorder.stop();
        }, 5000); // Adjust the duration as needed
      })
      .catch((error) => {
        console.error("Error capturing audio.", error);
      });
  };
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
    socket.on("call_connected_video", (data) => {
      console.log("Callllllllllllllllllllllllllll");
      const filteredUsers = connectedUsers.filter((user) => user.id === data);
      setIsAccepted(true);
      setIncomingVideo(filteredUsers);
    });

    socket.on("user_connect_request_video", (data) => {
      console.log("connnnnnnnnnnnnnnn", incomingVideo, data);
      const filteredUsers = connectedUsers.filter((user) => user.id === data);
      setIncomingVideo(filteredUsers);
    });
    socket.on("user_connect_request_audio", (data) => {
      console.log("audioooooooo", incomingAudio, data);
      const filteredUsers = connectedUsers.filter((user) => user.id === data);
      setIncomingAudio(filteredUsers);
    });
    return () => {
      socket.off("user_connect_request_video");
    };
  }, [incomingVideo, incomingAudio, accepted]);
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
      {incomingVideo?.length > 0 && (
        <VideoCallModal
          isOpen={incomingVideo?.length > 0}
          user={incomingVideo[0]}
          setValue={setIncomingVideo}
          IsAccepted={accepted}
          setAccept={setIsAccepted}
          onAudio={onAudioStream}
        />
      )}
      {incomingAudio?.length > 0 && audioCall ? (
        <AudioCallModal
          isOpen={true}
          user={incomingAudio[0]}
          setValue={setIncomingAudio}
          IsAccepted={accepted}
          setAccept={setIsAccepted}
          onAudio={onAudioStream}
        />
      ) : (
        <h4>Testing</h4>
      )}

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
  const { userOnline, activeChat } = state.user;
  return { userOnline, activeChat };
};

export default connect(mapStateToProps, {})(Index);

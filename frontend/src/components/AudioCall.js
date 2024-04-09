import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { socket } from "../helpers/socket";
import { useSelector } from "react-redux";
import config from "../config";
import Webcam from "react-webcam";
import ReactMic from "react-mic";

const AudioCallModal = ({ isOpen, user, setValue, IsAccepted, setAccept }) => {
  const webcamRef = useRef(null);
  const audioRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [accepted, setIsAccepted] = useState(IsAccepted); // Track if there's an incoming call
  const [Audiomodal, setAudioModal] = useState(isOpen);
  const [receivedStream, setReceivedStream] = useState(null);
  const [receivedAudioStream, setAudioStream] = useState(null);

  console.log("userrrr", user, IsAccepted);
  const toggleAudioModal = () => setAudioModal(!Audiomodal);

  useEffect(() => {
    socket.on("call_ended", () => {
      endCall();
    });

    socket.on("call_connected_video", () => {
      setIsAccepted(true);
    });
    // Listen for incoming video stream from the server

    socket.on("audio_received", (data) => {
      console.log("audiossss", data);
      // playAudioStream(data)
      let newData = data.split(";");
      newData[0] = "data:audio/ogg;";
      newData = newData[0] + newData[1];

      let audio = new Audio(newData);
      if (!audio || document.hidden) {
        return;
      }
      audio.play();
    });

    return () => {
      socket.off("audio_received");
      socket.off("call_connected_video");
      socket.off("call_ended");
    };
  }, []);

  const handleIgnore = () => {
    setValue(null);

    toggleAudioModal();
  };



  const handleAccept = () => {
    socket.emit("accepted_request", user.id);
    setIsAccepted(true);

    // onAudioStream();
  };

  const handleCut = () => {
    socket.emit("end_call", user.id);
    endCall();
  };

  const endCall = () => {
    setValue(null);
    setAccept(false);
    setAudioStream(null);
    toggleAudioModal();
  };
  return (
    <>
      {user && (
        <Modal
          tabIndex="-1"
          isOpen={Audiomodal}
          toggle={toggleAudioModal}
          centered
          keyboard={false}
          backdrop="static"
        >
          <ModalBody>
            <div className="text-center p-4">
              {!accepted ? (
                <div>
                  {user.profilePath !== null ? (
                    <div className="avatar-lg mb-4 mx-auto ">
                      <img
                        src={`${config.BASE_URL}${user.profilePath}`}
                        className="img-thumbnail h-100 rounded-circle"
                        alt="user"
                      />
                    </div>
                  ) : (
                    <div className="chat-user-img avatar-lg mx-auto  mt-4 align-self-center">
                      <div className="avatar-lg">
                        <span className="img-thumbnail  p-4 rounded-circle bg-soft-primary text-primary">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  <h5 className="text-truncate">
                    {user.firstName} {user.lastName}
                  </h5>
                  <p className="text-muted">Incoming Audio Call . . . </p>
                  <div>
                    <ul className="list-inline mb-1">
                      <li className="list-inline-item px-2 me-2 ms-0">
                        <button
                          type="button"
                          className="btn btn-danger avatar-sm rounded-circle"
                          onClick={handleIgnore}
                        >
                          <span className="avatar-title bg-transparent font-size-20">
                            <i className="ri-close-fill"></i>
                          </span>
                        </button>
                      </li>
                      <li className="list-inline-item px-2">
                        <button
                          type="button"
                          className="btn btn-success avatar-sm rounded-circle"
                          onClick={handleAccept}
                        >
                          <span className="avatar-title bg-transparent font-size-20">
                            <i className="ri-vidicon-fill"></i>
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  {receivedAudioStream && (
                    <audio ref={audioRef} controls autoPlay>
                      <source
                        src={`${receivedAudioStream}`}
                        type="audio/wav"
                      />
                      Testing
                    </audio>
                  )}

                  <button
                    type="button"
                    className="btn btn-danger avatar-sm rounded-circle ms-2"
                    onClick={handleCut} // This will reject the call
                  >
                    <span className="avatar-title bg-transparent font-size-20">
                      <i className="ri-close-fill"></i>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
};

export default AudioCallModal;

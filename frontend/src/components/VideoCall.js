import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { socket } from "../helpers/socket";
import { useSelector } from "react-redux";
import config from "../config";
import Webcam from "react-webcam";
import ReactMic from "react-mic";

const VideoCallModal = ({ isOpen, user, setValue, IsAccepted, setAccept ,onAudio}) => {
  const webcamRef = useRef(null);
  const audioRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [accepted, setIsAccepted] = useState(IsAccepted); // Track if there's an incoming call
  const [Videomodal, setVideoModal] = useState(isOpen);
  const [streamInterval, setStreamInterval] = useState(null);
  const [receivedStream, setReceivedStream] = useState(null);
  const [receivedAudioStream,setAudioStream] = useState(null)

  console.log("userrrr", user, IsAccepted);
  const toggleVideoModal = () => setVideoModal(!Videomodal);
  const playAudioStream = (data) => {
    const audioContext = new AudioContext();
    const channels = 1; // mono
    const frameCount = 1024;
    const audioBuffer = audioContext.createBuffer(channels, frameCount, audioContext.sampleRate);
  
    const audioData = new Int16Array(data);
    const float32Data = new Float32Array(audioData.length);
    
    // Normalize to [-1, 1]
    for (let i = 0; i < audioData.length; i++) {
      float32Data[i] = audioData[i] / 32768;
    }
    setAudioStream(float32Data);
    audioBuffer.copyToChannel(float32Data, 0);
  
    const source = audioContext.createBufferSource();
    console.log("sourceeeeee",source)
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  const fileTransfer = () => {
    const interval = setInterval(() => {
      if (webcamRef) {
        const imageSrc = webcamRef.current.getScreenshot();
      

        socket.emit("data_transfer", user.id, imageSrc);
      }
    }, 100); // Adjust the interval as needed for your use case
    setStreamInterval(interval);
  };

  useEffect(() => {
    socket.on("call_ended", () => {
      endCall();
    });

    socket.on("call_connected_video", () => {
      setIsAccepted(true);
    });
    // Listen for incoming video stream from the server
    socket.on("data_received", (data) => {
     
      setReceivedStream(data);
    });
    socket.on("audio_received",(data)=>{
      console.log("audiossss",data)
      // playAudioStream(data)
      let newData = data.split(";");
      newData[0] = "data:audio/ogg;";
      newData = newData[0] + newData[1];
      
      let audio = new Audio(newData);
      if (!audio || document.hidden) {
          return;
      }
      audio.play();
    })

    return () => {
      socket.off("receiveStream");
      socket.off("call_connected_video");
      socket.off("call_ended");
    };
  }, []);



 
  const handleIgnore = () => {
    setValue(null);

    toggleVideoModal();
  };

  const onError = (error) => {
    console.error("Error accessing audio stream:", error);
  };

  const handleAccept = () => {
    socket.emit("accepted_request", user.id);
    setIsAccepted(true);
    fileTransfer();
    onAudio();
    
  };

  const handleCut = () => {
    socket.emit("end_call", user.id);
    endCall();
  };

  const endCall = () => {
    clearInterval(streamInterval);
    setValue(null);
    setAccept(false);
    console.log("connnnnnnn", user);
    setStreamInterval(null);
    setAudioStream(null); 
    toggleVideoModal();
  };
  return (
    <>
      {user && (
        <Modal
          tabIndex="-1"
          isOpen={Videomodal}
          toggle={toggleVideoModal}
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
                  <p className="text-muted">Incoming Video Call . . . </p>
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
                  <div>
                    <Webcam
                      audio={true}
                      //   height={720}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      mirrored={true}

                      //   width={1280}
                    />
                  </div>

                  {receivedStream && (
                    <img src={receivedStream} alt="Received Stream" />
                  )}
                   {receivedAudioStream && (
                    <audio ref={audioRef} controls autoPlay>
                       <source src={`data:audio/wav;base64,${receivedAudioStream}`} type="audio/wav" />
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

export default VideoCallModal;

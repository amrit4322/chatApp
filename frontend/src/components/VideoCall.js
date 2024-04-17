import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalBody } from "reactstrap";
import { socket } from "../helpers/socket";
import { useDispatch, useSelector } from "react-redux";
import config from "../config";

import { userConnectedVideo } from "../redux/slice.auth";

let peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};
let localStream; //a var to hold the local video stream
let remoteStream; //a var to hold the remote video stream
let peerConnection; //the peerConnection that the two clients use to talk
let didIOffer = false;

const VideoCallModal = ({
  isOpen,
  userConnTo,
  setValue,
  IsAccepted,
  setAccept,
  isConnected,
  offerAvail,
}) => {

  let videoRef = useRef(null);
  let localVideoEl = useRef(null);
  let remoteVideoEl = useRef(null);
  const [accepted, setIsAccepted] = useState(IsAccepted); // Track if there's an incoming call
  const [Videomodal, setVideoModal] = useState(isOpen);
  const [callConnect, setCallConnect] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  console.log("offffffffffffffffffff", offerAvail);
  ////////////////////////////////////////////////////////////////////////

  console.log("newwwwwwwwwww", localStream);
  const call = async (e) => {
    await fetchUserMedia();

    //peerConnection is all set with our STUN servers sent over
    await createPeerConnection();

    //create offer time!
    try {
      console.log("Creating offer...");
      const offer = await peerConnection.createOffer();
      peerConnection.setLocalDescription(offer);
      console.log("offerrrrrr is ", offer);
      didIOffer = true;
      socket.emit("connecting_video", userConnTo.id, offer);

      // socket.emit("newOffer", offer); //send offer to signalingServer
    } catch (err) {
      console.log("errorrrr", err);
    }
  };

  const answerOffer = async (offerObj) => {
    await fetchUserMedia();
    await createPeerConnection(offerObj);
    const answer = await peerConnection.createAnswer({}); //just to make the docs happy
    await peerConnection.setLocalDescription(answer); //this is CLIENT2, and CLIENT2 uses the answer as the localDesc
    console.log("offerObj :", offerObj);
    console.log("answer : ", answer);
    // console.log(peerConnection.signalingState) //should be have-local-pranswer because CLIENT2 has set its local desc to it's answer (but it won't be)
    //add the answer to the offerObj so the server knows which offer this is related to
    offerObj.answer = answer;
    //emit the answer to the signaling server, so it can emit to CLIENT1
    //expect a response from the server with the already existing ICE candidates
    const offerIceCandidates = await socket.emitWithAck("newAnswer", offerObj);
    offerIceCandidates.forEach((c) => {
      peerConnection.addIceCandidate(c);
      console.log("======Added Ice Candidate======");
    });
    console.log("officeeeeeeeeeeeeeeeeeeee", offerIceCandidates);
  };

  const addAnswer = async (offerObj) => {
    //addAnswer is called in socketListeners when an answerResponse is emitted.
    //at this point, the offer and answer have been exchanged!
    //now CLIENT1 needs to set the remote
    await peerConnection.setRemoteDescription(offerObj.answer);
    // console.log(peerConnection.signalingState)
  };

  const fetchUserMedia = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localVideoEl.current.srcObject = stream;
        localStream = stream;
        resolve();
      } catch (err) {
        console.log("error is ", err);
        reject();
      }
    });
  };

  const createPeerConnection = (offerObj) => {
    return new Promise(async (resolve, reject) => {
      //RTCPeerConnection is the thing that creates the connection
      //we can pass a config object, and that config object can contain stun servers
      //which will fetch us ICE candidates
      peerConnection = await new RTCPeerConnection(peerConfiguration);
      console.log("Peer connection", peerConnection);
      remoteStream = new MediaStream();
      remoteVideoEl.current.srcObject = remoteStream;

      localStream.getTracks().forEach((track) => {
        //add localtracks so that they can be sent once the connection is established
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.addEventListener("signalingstatechange", (event) => {
        console.log("event", event);
        console.log("peerConnection", peerConnection.signalingState);
      });

      peerConnection.addEventListener("icecandidate", (e) => {
        console.log("........Ice candidate found!......");
        console.log("iceCandidatiate", e.candidate, didIOffer);
        //TODO uncomment this
        if (e.candidate) {
          console.log("emmittitngggg");
          socket.emit("sendIceCandidateToSignalingServer", {
            iceCandidate: e.candidate,
            iceUserId: user.id,
            didIOffer,
          });
        }
      });

      peerConnection.addEventListener("track", (e) => {
        console.log("Got a track from the other peer!! How excting");
        console.log(e);
        e.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track, remoteStream);
          console.log("Here's an exciting moment... fingers cross");
        });
      });

      if (offerObj) {
        //this won't be set when called from call();
        //will be set when we call from answerOffer()
        // console.log(peerConnection.signalingState) //should be stable because no setDesc has been run yet
        await peerConnection.setRemoteDescription(offerObj.offer);
        // console.log(peerConnection.signalingState) //should be have-remote-offer, because client2 has setRemoteDesc on the offer
      }
      resolve();
    });
  };

  const addNewIceCandidate = (iceCandidate) => {
    peerConnection.addIceCandidate(iceCandidate);
    console.log("======Added Ice Candidate======");
  };

  //////////////////////////////////////////////////////

  console.log("userrrr", userConnTo, IsAccepted);
  const toggleVideoModal = () => {
    console.log("testing modal box");
    setVideoModal(!Videomodal);
  };

  useEffect(() => {
    socket.on("call_ended_video", () => {
      endCall();
      dispatch(
        userConnectedVideo({
          connectedVideo: false,
        })
      );
    });

    socket.on("call_connected_video", () => {
      console.log("x44444444444444444444444");

      setCallConnect(true);
    });
    //   // Listen for incoming video stream from the server

    return () => {
      //     socket.off("video_received");
      socket.off("call_connected_video");
      socket.off("call_ended_video");
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      call();
    }

    socket.on("receivedIceCandidateFromServer", (iceCandidate) => {
      addNewIceCandidate(iceCandidate);
      console.log(iceCandidate);
    });

    socket.on("answerResponse", (offerObj) => {
      console.log(offerObj);
      addAnswer(offerObj);
    });

    return () => {
      socket.off("receivedIceCandidateFromServer");
      socket.off("answerResponse");
    };
  }, []);

  const handleIgnore = () => {
    setValue(null);

    toggleVideoModal();
  };

  const rejectConnecton = () => {
    console.log("rejectConnecton");
    setValue(null);
   
    handleCut();
    toggleVideoModal();
  };
  const handleAccept = () => {
    socket.emit("accepted_request_video", userConnTo.id);
    console.log("ofeeeeee", offerAvail);
    setIsAccepted(true);
    // onVideoStream();
    answerOffer(offerAvail[0]);
    // onVideoStream();
  };

  const handleCut = () => {
    console.log("handleCUt", localStream);
    socket.emit("end_call_video", userConnTo.id);
    endCall();
    dispatch(
      userConnectedVideo({
        connectedVideo: false,
      })
    );
  };

  const endCall = async () => {
    setValue(null);
    setAccept(false);
    setIsAccepted(false);
    if (localStream) {
      console.log("inside local", localStream);
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    toggleVideoModal();
  };
  return (
    <>
      {userConnTo && (
        <Modal
          tabIndex="-1"
          isOpen={Videomodal}
          toggle={toggleVideoModal}
          centered
          keyboard={false}
          backdrop="static"
          size="lg"
        >
          <ModalBody>
            <div className="text-center p-4">
              {isConnected ? (
                <div>
                  {userConnTo.profilePath !== null ? (
                    <div className="avatar-lg mb-4 mx-auto ">
                      <img
                        src={`${config.BASE_URL}${userConnTo.profilePath}`}
                        className="img-thumbnail h-100 rounded-circle"
                        alt="userConnTo"
                      />
                    </div>
                  ) : (
                    <div className="chat-user-img avatar-lg mx-auto  mt-4 align-self-center">
                      <div className="avatar-lg">
                        <span className="img-thumbnail  p-4 rounded-circle bg-soft-primary text-primary">
                          {userConnTo.firstName.charAt(0)}
                          {userConnTo.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  <h5 className="text-truncate">
                    {userConnTo.firstName} {userConnTo.lastName}
                  </h5>
                  <video
                    className="video-player"
                    id="local-video"
                    ref={localVideoEl}
                    autoPlay
                    playsInline
                    muted
                    // controls="volume fullscreen"
                  ></video>
                  <video
                    className="video-player"
                    id="remote-video"
                    ref={remoteVideoEl}
                    autoPlay
                    playsInline
                    controls
                    style={callConnect ? {} : { display: "none" }}
                  ></video>
                  {!callConnect && (
                    <p className="text-muted">
                      Connecting . . . <span>{accepted}</span>
                    </p>
                  )}
                  <div>
                    <ul className="list-inline mb-1">
                      <li className="list-inline-item px-2 me-2 ms-0">
                        <button
                          type="button"
                          className="btn btn-danger avatar-sm rounded-circle"
                          onClick={callConnect ? handleCut : rejectConnecton}
                        >
                          <span className="avatar-title bg-transparent font-size-20">
                            <i className="ri-close-fill"></i>
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : !accepted ? (
                <div>
                  {userConnTo.profilePath !== null ? (
                    <div className="avatar-lg mb-4 mx-auto ">
                      <img
                        src={`${config.BASE_URL}${userConnTo.profilePath}`}
                        className="img-thumbnail h-100 rounded-circle"
                        alt="userConnTo"
                      />
                    </div>
                  ) : (
                    <div className="chat-user-img avatar-lg mx-auto  mt-4 align-self-center">
                      <div className="avatar-lg">
                        <span className="img-thumbnail  p-4 rounded-circle bg-soft-primary text-primary">
                          {userConnTo.firstName.charAt(0)}
                          {userConnTo.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                  <h5 className="text-truncate">
                    {userConnTo.firstName} {userConnTo.lastName}
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
                            <i className="ri-phone-fill"></i>
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-5">
                  <div id="videos">
                    <div id="video-wrapper">
                      <div id="waiting" className="btn btn-warning">
                        Waiting for answer...
                      </div>
                    </div>
                    <video
                      className="video-player"
                      id="local-video"
                      ref={localVideoEl}
                      autoPlay
                      playsInline
                      // controls="volume fullscreen"
                    ></video>
                    <video
                      className="video-player"
                      id="remote-video"
                      ref={remoteVideoEl}
                      autoPlay
                      playsInline
                      controls
                    ></video>
                  </div>

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

import React, { useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  Input,
  Row,
  Col,
  Modal,
  ModalBody,
} from "reactstrap";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";

//import images
import config from "../../../config";
import { socket } from "../../../helpers/socket";
import { userConnectedAudio, userConnectedVideo } from "../../../redux/slice.auth";

const UserHead = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [Callmodal, setCallModal] = useState(false);
  const [Videomodal, setVideoModal] = useState(false);
  const dispatch = useDispatch();
  const toggle = () => setDropdownOpen(!dropdownOpen);
  const toggle1 = () => setDropdownOpen1(!dropdownOpen1);
  const toggleCallModal = () => setCallModal(!Callmodal);
  const toggleVideoModal = () => setVideoModal(!Videomodal);
  console.log("rrrrrrrrrrrr",props.activeChat)
  const openUserSidebar = (e) => {
    e.preventDefault();
    props.openUserSidebar();
  };

  const closeUserChat=(e) =>{
    e.preventDefault();
    var userChat = document.getElementsByClassName("user-chat");
    if (userChat) {
      userChat[0].classList.remove("user-chat-show");
    }
  }

  const  deleteMessage= () =>{
    let allUsers = props.users;
    let copyallUsers = allUsers;
    copyallUsers[props.active_user].messages = [];
  }
  const handleVideoCall =(id)=>{
    console.log("testingggg",id)
    // socket.emit("connecting_video",id)
    console.log("dispatching ConnectedVideo")
    dispatch(userConnectedVideo({
      connectedVideo:true
    }))
    setVideoModal(false)
  }
  const handleAudioCall =(id)=>{
    console.log("testingggg Audio",id)
    dispatch(userConnectedAudio({
      connectedAudio:true
    }))
    setCallModal(false)
  }

  return (
    <React.Fragment>
      {props.activeChat ? (
        <div>
          <div className="p-3 p-lg-4 border-bottom">
            <Row className="align-items-center">
              <Col sm={4} xs={8}>
                <div className="d-flex align-items-center">
                  <div className="d-block d-lg-none me-2 ms-0">
                    <Link
                      to="#"
                      onClick={(e) => closeUserChat(e)}
                      className="user-chat-remove text-muted font-size-16 p-2"
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </Link>
                  </div>
                  {props.activeChat.profilePath !== null ? (
                    <div className="me-3 ms-0">
                      <img
                      
                        src={`${config.BASE_URL}${props.activeChat?.profilePath}`}
                        className="rounded-circle avatar-xs"
                        alt="chatvia"
                      />
                    </div>
                  ) : (
                    <div className="chat-user-img align-self-center me-3">
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                          {props.activeChat?.firstName.charAt(0)}
                          {props.activeChat?.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex-grow-1 overflow-hidden">
                    <h5 className="font-size-16 mb-0 text-truncate">
                      <Link
                        to="#"
                        onClick={(e) => openUserSidebar(e)}
                        className="text-reset user-profile-show"
                      >
                        {props.activeChat?.firstName}{" "}
                        {props.activeChat?.lastName}
                      </Link>
                      
                      {(() => {
                        switch (props.activeChat?.status) {
                          case "online":
                            return (
                              <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-1"></i>
                            );

                          case "away":
                            return (
                              <i className="ri-record-circle-fill font-size-10 text-warning d-inline-block ms-1"></i>
                            );

                          case "offline":
                            return (
                              <i className="ri-record-circle-fill font-size-10 text-secondary d-inline-block ms-1"></i>
                            );

                          default:
                            return;
                        }
                      })()}
                    </h5>
                  </div>
                </div>
              </Col>
              <Col sm={8} xs={4}>
                <ul className="list-inline user-chat-nav text-end mb-0">
                  <li className="list-inline-item">
                    <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                      <DropdownToggle
                        color="none"
                        className="btn nav-btn "
                        type="button"
                      >
                        <i className="ri-search-line"></i>
                      </DropdownToggle>
                      <DropdownMenu className="p-0 dropdown-menu-end dropdown-menu-md">
                        <div className="search-box p-2">
                          <Input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Search.."
                          />
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </li>
                  <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                    <button
                      type="button"
                      onClick={toggleCallModal}
                      className="btn nav-btn"
                    >
                      <i className="ri-phone-line"></i>
                    </button>
                  </li>
                  <li className="list-inline-item d-none d-lg-inline-block me-2 ms-0">
                    <button
                      type="button"
                      onClick={toggleVideoModal}
                      className="btn nav-btn"
                    >
                      <i className="ri-vidicon-line"></i>
                    </button>
                  </li>

                  <li className="list-inline-item d-none d-lg-inline-block">
                    <Button
                      type="button"
                      color="none"
                      onClick={(e) => openUserSidebar(e)}
                      className="nav-btn user-profile-show"
                    >
                      <i className="ri-user-2-line"></i>
                    </Button>
                  </li>

                  <li className="list-inline-item">
                    <Dropdown isOpen={dropdownOpen1} toggle={toggle1}>
                      <DropdownToggle
                        className="btn nav-btn "
                        color="none"
                        type="button"
                      >
                        <i className="ri-more-fill"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <DropdownItem
                          className="d-block d-lg-none user-profile-show"
                          onClick={(e) => openUserSidebar(e)}
                        >
                          View profile{" "}
                          <i className="ri-user-2-line float-end text-muted"></i>
                        </DropdownItem>
                        <DropdownItem>
                          Archive{" "}
                          <i className="ri-archive-line float-end text-muted"></i>
                        </DropdownItem>
                        <DropdownItem>
                          Muted{" "}
                          <i className="ri-volume-mute-line float-end text-muted"></i>
                        </DropdownItem>
                        <DropdownItem onClick={(e) => deleteMessage(e)}>
                          Delete{" "}
                          <i className="ri-delete-bin-line float-end text-muted"></i>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </li>
                </ul>
              </Col>
            </Row>
          </div>

          {/* Start Audiocall Modal */}
          <Modal
            tabIndex="-1"
            isOpen={Callmodal}
            toggle={toggleCallModal}
            centered
          >
            <ModalBody>
              <div className="text-center p-4">
              {props.activeChat.profilePath !== null ? (
                    <div className="avatar-lg mb-4 mx-auto ">
                      <img
                      
                        src={`${config.BASE_URL}${props.activeChat?.profilePath}`}
                        className="img-thumbnail h-100 rounded-circle"
                        alt="user"
                      />
                    </div>
                  ) : (
                    <div className="chat-user-img avatar-lg mx-auto  mt-4 align-self-center">
                      <div className="avatar-lg">
                        <span className="img-thumbnail  p-4 rounded-circle bg-soft-primary text-primary">
                          {props.activeChat?.firstName.charAt(0)}
                          {props.activeChat?.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                {/* <div className="avatar-lg mx-auto mb-4">
                  <img
                    src={user}
                    alt=""
                    className="img-thumbnail rounded-circle"
                  />
                </div> */}

                <h5 className="text-truncate">{props.activeChat.firstName} {props.activeChat.lastName}</h5>
                <p className="text-muted">Start Audio Call</p>

                <div className="mt-5">
                  <ul className="list-inline mb-1">
                    <li className="list-inline-item px-2 me-2 ms-0">
                      <button
                        type="button"
                        className="btn btn-danger avatar-sm rounded-circle"
                        onClick={toggleCallModal}
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
                        onClick={()=>handleAudioCall(props.activeChat.id)}
                      >
                        <span className="avatar-title bg-transparent font-size-20">
                          <i className="ri-phone-fill"></i>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </ModalBody>
          </Modal>

          {/* Start VideoCall Modal */}
          <Modal
            tabIndex="-1"
            isOpen={Videomodal}
            toggle={toggleVideoModal}
            centered
          >
            <ModalBody>
              <div className="text-center p-4">
              {props.activeChat.profilePath !== null ? (
                    <div className="avatar-lg mb-4 mx-auto ">
                      <img
                      
                        src={`${config.BASE_URL}${props.activeChat?.profilePath}`}
                        className="img-thumbnail h-100 rounded-circle"
                        alt="user"
                      />
                    </div>
                  ) : (
                    <div className="chat-user-img avatar-lg mx-auto  mt-4 align-self-center">
                      <div className="avatar-lg">
                        <span className="img-thumbnail  p-4 rounded-circle bg-soft-primary text-primary">
                          {props.activeChat?.firstName.charAt(0)}
                          {props.activeChat?.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}

                <h5 className="text-truncate">{props.activeChat.firstName} {props.activeChat.lastName}</h5>
                <p className="text-muted">Start Video Call</p>

                <div className="mt-5">
                  <ul className="list-inline mb-1">
                    <li className="list-inline-item px-2 me-2 ms-0">
                      <button
                        type="button"
                        className="btn btn-danger avatar-sm rounded-circle"
                        onClick={toggleVideoModal}
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
                        onClick={()=>handleVideoCall(props.activeChat.id)}
                      >
                     
                        <span className="avatar-title bg-transparent font-size-20">
                          <i className="ri-vidicon-fill"></i>
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <div className="mt-4 d-flex align-items-center justify-content-center ">
        <h3 className="align-items-center">No selected contact</h3>
      </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return { ...state.user };
};

export default connect(mapStateToProps)(UserHead);

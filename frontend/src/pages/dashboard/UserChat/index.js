import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  CardBody,
  Button,
  ModalFooter,
} from "reactstrap";
import { connect, useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import SimpleBar from "simplebar-react";

import withRouter from "../../../components/withRouter";

//Import Components
import UserProfileSidebar from "../../../components/UserProfileSidebar";
import SelectContact from "../../../components/SelectContact";
import UserHead from "./UserHead";
import ImageList from "./ImageList";
import ChatInput from "./ChatInput";
import FileList from "./FileList";

//actions

//i18n
import { useTranslation } from "react-i18next";
import { socket } from "../../../helpers/socket";
import { userChats } from "../../../redux/slice.auth";
import config from "../../../config";
import { format } from "date-fns";
import API from "../../../helpers/api";

const UserChat = (props) => {
  const ref = useRef();
  const [modal, setModal] = useState(false);

  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();
  const dispatch = useDispatch();
  //demo conversation messages
  //userType must be required
  const [allUsers] = useState(props.recentChatList);
  const [chatMessages, setchatMessages] = useState([]);
  const apiInstance = new API();
  const token = useSelector((state) => state.user.token);
  const setMessageData = (data) => {
    console.log("MESHSDFJSJDFDF", data);
    dispatch(
      userChats({
        chats: data,
      })
    );
  };

  const handleIncomingMessage = (data) => {
    console.log("handleIncomingMessage", data);
    console.log("props.activeChat?.id ", props.activeChat?.id);
    console.log(
      "props.activeChat?.id === data.id",
      props.activeChat?.id === data.author
    );
    let incomingData =  { ...data };;
    incomingData.isFileMessage = incomingData.isFileMessage=="true";
    incomingData.isImageMessage = incomingData.isImageMessage=="true";
    console.log("incomingData ", incomingData);


    if (props.activeChat?.id === data.author) {
      setchatMessages([...chatMessages, incomingData]);
      dispatch(
        userChats({
          chats: [...chatMessages, incomingData],
        })
      );
    }
  };

  const fetchChats = () => {
    console.log("filteredChats ", props.chats);
    setchatMessages(props.chats);
  };

  // Generate a UUID
  function generateMessageId() {
    return uuidv4();
  }
  socket.on("message", handleIncomingMessage);

  useEffect(() => {
    if (props.activeChat?.id) {
      socket.emit("fetch_message", props.activeChat.id);
    }
    socket.on("user_message_data", setMessageData);
    return () => {
      socket.off("fetch_message");
      socket.off("user_message_data");
      socket.off("message");
    };
  }, [props.activeChat?.id]);

  // useEffect(()=>{
  //   dispatch(
  //       userChats({
  //         chats: chatMessages,
  //       })
  //     );
  // },[dispatch,chatMessages])

  useEffect(() => {
    fetchChats();
    ref.current.recalculate();
    if (ref.current.el) {
      ref.current.getScrollElement().scrollTop =
        ref.current.getScrollElement().scrollHeight;
    }
  }, [chatMessages, props.activeChat?.id, props.chats]);

  const toggle = () => setModal(!modal);

  const addMessage = async (message, type, id) => {
    let messageObj = null;
    console.log("obj jjjjjjjj", message);
    let d = new Date().toISOString();

    //matches the message type is text, file or image, and create object according to it
    switch (type) {
      case "textMessage":
        messageObj = {
          id: generateMessageId(),
          message: message,
          timestamp: d,
          author: props.user.id,
          isFileMessage: false,
          isImageMessage: false,
          seen: false,
        };
        break;

      case "fileMessage":
        // let fileMessage = JSON.stringify(message);

        messageObj = {
          id: generateMessageId(),
          message: "",
          timestamp: d,
          author: props.user.id,
          isFileMessage: true,
          isImageMessage: false,
          seen: false,
        };
        break;

      case "imageMessage":
        messageObj = {
          id: generateMessageId(),
          message: "",
          timestamp: d,
          author: props.user.id,
          isImageMessage: true,
          isFileMessage: false,
          seen: false,
        };
        break;

      default:
        break;
    }

    //add message object to chat
    if (type === "textMessage") {
      socket.emit("message_send", messageObj, props.activeChat.id);
    } else {
      console.log("testing of message", messageObj);
      const formData = new FormData();
      formData.append("file", message);
      formData.append("id", messageObj.id);
      formData.append("data", "");
      formData.append("timestamp", messageObj.timestamp);
      formData.append("senderId", messageObj.author);
      formData.append("receiverId", props.activeChat.id);
      formData.append("isFileMessage", messageObj.isFileMessage);
      formData.append("isImageMessage", messageObj.isImageMessage);
      formData.append("seen", messageObj.seen);
      let response = await apiInstance.uploadFile(
        "/chat/uploadfile",
        formData,
        token
      );
      if (response.status) {
        console.log("Responseeeeeeeee", response);

        let data = response.message.data;
        messageObj = {
          id: data.id,
          message: data.data,
          timestamp: data.timestamp,
          author: data.senderId,
          isFileMessage: data.isFileMessage,
          isImageMessage: data.isImageMessage,
          seen: data.seen,
        };
      } else {
        return { status: true };
      }
    }
    console.log("messsssssssssssssssss", messageObj);
    setchatMessages((prevChatMessages) => [...prevChatMessages, messageObj]);

    dispatch(
      userChats({
        chats: [...chatMessages, messageObj],
      })
    );

    // let copyallUsers = [...allUsers];
    // copyallUsers[props.active_user].messages = [...chatMessages, messageObj];
    // copyallUsers[props.active_user].isTyping = false;
    // props.setFullUser(copyallUsers);

    scrolltoBottom();
    return { status: true };
  };

  function scrolltoBottom() {
    console.log("refsfsfnsdffff", ref.current.getScrollElement());
    if (ref.current.el) {
      ref.current.getScrollElement().scrollTop =
        ref.current.getScrollElement().scrollHeight;
    }
  }

  const deleteMessage = (id) => {
    let conversation = chatMessages;

    var filtered = conversation.filter(function (item) {
      return item.id !== id;
    });

    setchatMessages(filtered);
  };

  return (
    <div className="user-chat w-100">
      <div className="d-lg-flex">
        <div className={props.userSidebar ? "w-70" : "w-100"}>
          {/* render user head */}
          <UserHead />

          <SimpleBar
            style={{ maxHeight: "100%" ,flexDirection: "column-reverse"}}
            ref={ref}
            className="chat-conversation p-3 p-lg-4 "
            id="messages"
          >
            <ul className="list-unstyled mb-0">
              {chatMessages?.map((chat, key) =>
                new Date(chat.timeStamp).toDateString() ===
                new Date().toDateString() ? (
                  <li key={"dayTitle" + key}>
                    <div className="chat-day-title">
                      <span className="title">Today</span>
                    </div>
                  </li>
                ) : props.recentChatList[props.active_user]?.isGroup ===
                  true ? (
                  <li
                    key={key}
                    className={chat.userType === "sender" ? "right" : ""}
                  >
                    <div className="conversation-list">
                      <div className="chat-avatar">
                        {chat.author === props.user?.id ? (
                          props.user?.profilePath === null ? (
                            <div className="chat-user-img align-self-center ">
                              <div className="avatar-xs">
                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                  {props.user.firstName.charAt(0)}
                                  {props.user.lastName.charAt(0)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={`${config.BASE_URL}${props.user?.profilePath}`}
                              alt="chatv"
                            />
                          )
                        ) : props.activeChat?.profilePath === null ? (
                          <div className="chat-user-img align-self-center">
                            <div className="avatar-xs">
                              <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                {props.activeChat.firstName.charAt(0)}
                                {props.activeChat.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <img
                            src={`${config.BASE_URL}${props.activeChat?.profilePath}`}
                            alt="chatvia"
                          />
                        )}
                      </div>

                      <div
                        className="user-chat-content text-break "
                        style={{ maxWidth: "450px" }}
                      >
                        <div className="ctext-wrap ">
                          <div className="ctext-wrap-content">
                            {chat.message &&
                              !chat?.isImageMessage &&
                              !chat?.isFileMessage && (
                                <p className="mb-0">teee{chat.message}</p>
                              )}
                            {chat?.isImageMessage && (
                              // image list component
                              <ImageList images={chat.message} />
                            )}
                            {chat?.isFileMessage && (
                              //file input component

                              <FileList
                                file={chat?.message}
                                // fileName={chat?.fileMessage}
                                // fileSize={chat?.size}
                              />
                            )}
                            {chat?.isTyping && (
                              <p className="mb-0">
                                typing
                                <span className="animate-typing">
                                  <span className="dot ms-1"></span>
                                  <span className="dot ms-1"></span>
                                  <span className="dot ms-1"></span>
                                </span>
                              </p>
                            )}
                            {!chat?.isTyping && (
                              <p className="chat-time mb-0">
                                <i className="ri-time-line align-middle"></i>{" "}
                                <span className="align-middle">
                                  {format(new Date(chat.timestamp), "HH:mm a")}
                                </span>
                              </p>
                            )}
                          </div>
                          {!chat?.isTyping && (
                            <UncontrolledDropdown className="align-self-start">
                              <DropdownToggle tag="a">
                                <i className="ri-more-2-fill"></i>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>
                                  {t("Copy")}{" "}
                                  <i className="ri-file-copy-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem>
                                  {t("Save")}{" "}
                                  <i className="ri-save-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem onClick={toggle}>
                                  Forward{" "}
                                  <i className="ri-chat-forward-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => deleteMessage(chat.id)}
                                >
                                  Delete{" "}
                                  <i className="ri-delete-bin-line float-end text-muted"></i>
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          )}
                        </div>

                        <div className="conversation-name">
                          {chat?.author === props.user.id
                            ? `${props.user.firstName} ${props.user.lastName}`
                            : `${props.activeChat.firstName} ${props.activeChat.lastName}`}
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li
                    key={key}
                    className={chat?.author === props.user.id ? "right" : ""}
                  >
                    <div className="conversation-list">
                      {
                        //logic for display user name and profile only once, if current and last messaged sent by same receiver
                        chatMessages[key + 1] ? (
                          chatMessages[key].author ===
                          chatMessages[key + 1].author ? (
                            <div className="chat-avatar">
                              <div className="blank-div"></div>
                            </div>
                          ) : (
                            <div className="chat-avatar">
                              {chat?.author === props.user.id ? (
                                props.user?.profilePath === null ? (
                                  <div className="chat-user-img align-self-center">
                                    <div className="avatar-xs">
                                      <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                        {props.user.firstName.charAt(0)}
                                        {props.user.lastName.charAt(0)}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={`${config.BASE_URL}${props.user?.profilePath}`}
                                    alt="chatvia"
                                  />
                                )
                              ) : props.activeChat?.profilePath === null ? (
                                <div className="chat-user-img align-self-center ">
                                  <div className="avatar-xs">
                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                      {props.activeChat.firstName.charAt(0)}
                                      {props.activeChat.lastName.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={`${config.BASE_URL}${props.activeChat?.profilePath}`}
                                  alt="cha"
                                />
                              )}
                            </div>
                          )
                        ) : (
                          <div className="chat-avatar">
                            {chat.author === props.user.id ? (
                              props.user?.profilePath === null ? (
                                <div className="chat-user-img align-self-center ">
                                  <div className="avatar-xs">
                                    <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                      {props.user.firstName.charAt(0)}
                                      {props.user.lastName.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={`${config.BASE_URL}${props.user?.profilePath}`}
                                  alt="chatvia"
                                />
                              )
                            ) : props.activeChat?.profilePath === null ? (
                              <div className="chat-user-img align-self-center">
                                <div className="avatar-xs">
                                  <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                    {props.activeChat?.firstName.charAt(0)}
                                    {props.activeChat?.lastName.charAt(0)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={`${config.BASE_URL}${props.activeChat?.profilePath}`}
                                alt="chatvia"
                              />
                            )}
                          </div>
                        )
                      }

                      <div
                        className="user-chat-content text-break  "
                        style={{ maxWidth: "450px" }}
                      >
                        <div className="ctext-wrap">
                          <div className="ctext-wrap-content ">
                            {chat.message &&
                              !chat?.isImageMessage &&
                              !chat?.isFileMessage && (
                                <p className="mb-0">{chat.message}</p>
                              )}
                            {chat.isImageMessage && (
                              // image list component
                              <ImageList images={chat.message} />
                            )}
                            {chat.isFileMessage && (
                              //file input component
                              <FileList
                                file={chat.message}
                                // fileName={chat?.fileMessage}
                                // fileSize={chat?.size}
                              />
                            )}
                            {chat?.isTyping && (
                              <p className="mb-0">
                                typing
                                <span className="animate-typing">
                                  <span className="dot ms-1"></span>
                                  <span className="dot ms-1"></span>
                                  <span className="dot ms-1"></span>
                                </span>
                              </p>
                            )}
                            {!chat?.isTyping && (
                              <p className="chat-time mb-0">
                                <i className="ri-time-line align-middle"></i>{" "}
                                <span className="align-middle">
                                  {format(new Date(chat.timestamp), "HH:mm a")}
                                </span>
                              </p>
                            )}
                          </div>
                          {!chat?.isTyping && (
                            <UncontrolledDropdown className="align-self-start">
                              <DropdownToggle tag="a">
                                <i className="ri-more-2-fill"></i>
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>
                                  {t("Reply")}{" "}
                                  <i className="ri-reply-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem>
                                  {t("Copy")}{" "}
                                  <i className="ri-file-copy-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem>
                                  {t("Save")}{" "}
                                  <i className="ri-save-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem onClick={toggle}>
                                  Forward{" "}
                                  <i className="ri-chat-forward-line float-end text-muted"></i>
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => deleteMessage(chat.id)}
                                >
                                  Delete{" "}
                                  <i className="ri-delete-bin-line float-end text-muted"></i>
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          )}
                        </div>
                        {chatMessages[key + 1] ? (
                          chatMessages[key].author ===
                          chatMessages[key + 1].author ? null : (
                            <div className="conversation-name">
                              {chat.author === props.user.id
                                ? props.user.firstName
                                : props.activeChat?.firstName}
                            </div>
                          )
                        ) : (
                          <div className="conversation-name">
                            {chat.author === props.user.id
                              ? props.user.firstName
                              : props.activeChat?.firstName}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                )
              )}
            </ul>
          </SimpleBar>

          <Modal backdrop="static" isOpen={modal} centered toggle={toggle}>
            <ModalHeader toggle={toggle}>Forward to...</ModalHeader>
            <ModalBody>
              <CardBody className="p-2">
                <SimpleBar style={{ maxHeight: "200px" }}>
                  <SelectContact handleCheck={() => {}} />
                </SimpleBar>
                <ModalFooter className="border-0">
                  <Button color="primary">Forward</Button>
                </ModalFooter>
              </CardBody>
            </ModalBody>
          </Modal>
          {props.activeChat?.id && (
            <ChatInput addMessage={addMessage} id={props.activeChat?.id} />
          )}
        </div>

        {/* <UserProfileSidebar
          activeUser={props.recentChatList[props.active_user]}
        /> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { userOnline, user, activeChat, chats } = state.user;
  return { userOnline, user, activeChat, chats };
};

export default withRouter(connect(mapStateToProps)(UserChat));

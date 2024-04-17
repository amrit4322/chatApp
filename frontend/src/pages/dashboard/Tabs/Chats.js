import React, { Component, useEffect, useState } from "react";
import { Input, InputGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";

//simplebar
import SimpleBar from "simplebar-react";

//components
import OnlineUsers from "./OnlineUsers";
import ChatItem from "../../../components/chatItem";
import { socket } from "../../../helpers/socket";
import { userActiveChat, userChats, userConnected, userRecent } from "../../../redux/slice.auth";

const Chats = ({ recent, activeChat }) => {
  console.log("recent data ",recent)
  const [searchChat, setSearchChat] = useState("");
  const [filteredChatList, setFilteredChatList] = useState(recent || null);
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.user.user)

  //TODO hadnlemesgg


  const setContactData = (data) => {
    console.log("Recentttttttttttttttt",data)
    dispatch(
      userRecent({
        recent: data,
      })
    );
  };
  useEffect(() => {
    var li = document.getElementById(activeChat);
    if (li) {
      li.classList.add("active");
    }
  }, [activeChat]);

  useEffect(() => {
    setFilteredChatList(recent);
  }, [recent]);

  useEffect(() => {
    if(user?.id){
      console.log("emmitting fetch")
    socket.emit("fetchAllConnection");
   
    }

    socket.on("user_connect_data", setContactData);

    return () => {
   
      socket.off("user_connect_data", setContactData);
      socket.off("fetchAllConnection");
    };
  }, [user?.id]);

  const handleChange = (e) => {
    setSearchChat(e.target.value);
    const search = e.target.value.toLowerCase();
    const filteredArray = recent.filter(
      (element) =>
        element.firstName.toLowerCase().includes(search) ||
        element.lastName.toUpperCase().includes(search)
    );
    setFilteredChatList(filteredArray);
    if (search === "") {
      setFilteredChatList(recent);
    }
  };

  const openUserChat = (e, chat) => {
    e.preventDefault();
    const index = recent.indexOf(chat);
    console.log("indexxxxx", chat);
    dispatch(
      userActiveChat({
        activeChat: chat,
      })
    );

    const chatList = document.getElementById("chat-list");
    let currentli = null;

    if (chatList) {
      const li = chatList.getElementsByTagName("li");
      for (const element of li) {
        if (element.classList.contains("active")) {
          element.classList.remove("active");
        }
      }
      for (const element of li) {
        if (element.contains(e.target)) {
          currentli = element;
          break;
        }
      }
    }

    if (currentli) {
      currentli.classList.add("active");
    }

    const userChat = document.getElementsByClassName("user-chat");
    if (userChat) {
      userChat[0].classList.add("user-chat-show");
    }

    const unread = document.getElementById("unRead" + chat.id);
    if (unread) {
      unread.style.display = "none";
    }
  };

  return (
    <div>
      <div className="px-4 pt-4">
        <h4 className="mb-4">Chats</h4>
        <div className="search-box chat-search-box">
          <InputGroup size="lg" className="mb-3 rounded-lg">
            <span
              className="input-group-text text-muted bg-light pe-1 ps-3"
              id="basic-addon1"
            >
              <i className="ri-search-line search-icon font-size-18"></i>
            </span>
            <Input
              type="text"
              value={searchChat}
              onChange={(e) => handleChange(e)}
              className="form-control bg-light"
              placeholder="Search messages or users"
            />
          </InputGroup>
        </div>
        {/* Search Box */}
      </div>

      {/* online users */}
      <OnlineUsers />

      {/* Start chat-message-list  */}
      <div className="px-2">
        <h5 className="mb-3 px-3 font-size-16">Recent</h5>
        <SimpleBar style={{ maxHeight: "100%" }} className="chat-message-list">
          <ul className="list-unstyled chat-list chat-user-list" id="chat-list">
            {recent?.map((chat, key) => (
              <ChatItem
                key={key}
                chat={chat}
                active_user={activeChat}
                openUserChat={openUserChat}
              />
            ))}
          </ul>
        </SimpleBar>
      </div>
      {/* End chat-message-list */}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { activeChat, recent } = state.user;
  return { activeChat, recent };
};

export default connect(mapStateToProps)(Chats);

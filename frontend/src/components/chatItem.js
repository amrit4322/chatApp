import React from "react";
import { Link } from "react-router-dom";
import config from "../config";

const ChatItem = ({ chat, active_user, openUserChat }) => {
  return (
    <li
      key={chat.id}
      id={"conversation" + chat.id}
      className={
        chat.unRead
          ? "unread"
          : chat.isTyping
          ? "typing"
          : chat.id === active_user
          ? "active"
          : ""
      }
    >
      <Link to="#" onClick={(e) => openUserChat(e, chat)}>
        <div className="d-flex">
          {chat.profilePath === null ? (
            <div
              className={
                "chat-user-img " + chat.status + " align-self-center me-3 ms-0"
              }
            >
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                  {chat.firstName.charAt(0)}
                  {chat.lastName.charAt(0)}
                </span>
              </div>
              {chat.status && <span className="user-status"></span>}
            </div>
          ) : (
            <div
              className={
                "chat-user-img " + chat.status + " align-self-center me-3 ms-0"
              }
            >
              <img
                src={`${config.BASE_URL}${chat.profilePath}`}
                className="rounded-circle avatar-xs"
                alt="pic"
              />
            </div>
          )}

          <div className="flex-grow-1 overflow-hidden">
            <h5 className="text-truncate font-size-15 mb-1">
              {chat.firstName}
            </h5>
            <p className="chat-user-message text-truncate mb-0">
              {chat?.isTyping ? (
                <>
                  typing
                  <span className="animate-typing">
                    <span className="dot ms-1"></span>
                    <span className="dot ms-1"></span>
                    <span className="dot ms-1"></span>
                  </span>
                </>
              ) : (
                <>
                  {chat.messages &&
                  chat.messages.length > 0 &&
                  chat.messages[chat.messages.length - 1].isImageMessage ===
                    true ? (
                    <i className="ri-image-fill align-middle me-1"></i>
                  ) : null}
                  {chat.messages &&
                  chat.messages.length > 0 &&
                  chat.messages[chat.messages.length - 1].isFileMessage ===
                    true ? (
                    <i className="ri-file-text-fill align-middle me-1"></i>
                  ) : null}
                  {chat.messages && chat.messages.length > 0
                    ? chat.messages[chat.messages.length - 1].message
                    : null}
                </>
              )}
            </p>
          </div>
          <div className="font-size-11">
            {chat.messages && chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].time
              : null}
          </div>
          {chat.unRead === 0 ? null : (
            <div className="unread-message" id={"unRead" + chat.id}>
              <span className="badge badge-soft-danger rounded-pill">
                {chat.messages && chat.messages.length > 0
                  ? chat.unRead >= 20
                    ? chat.unRead + "+"
                    : chat.unRead
                  : ""}
              </span>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
};

export default ChatItem;

import React from "react";
import config from "../config";

const BoxElement = ({ child }) => {
  return (
    <div>
      <li key={child.id}>
        <div className="d-flex align-items-center">
          {child.profilePath ? (
            <div className={"chat-user-img " + " align-self-center me-3 ms-0"}>
              <img
                src={`${config.BASE_URL}${child.profilePath}`}
                className="rounded-circle avatar-xs"
                alt="pic"
              />
            </div>
          ) : (
            <div className={"chat-user-img " + " align-self-center me-3 ms-0"}>
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                  {child.firstName.charAt(0)}
                  {child.lastName.charAt(0)}
                </span>
              </div>
            </div>
          )}
          <div className="flex-grow-1">
            <h5 className="font-size-14 m-0">
              {child.firstName} {child.lastName}
            </h5>
            <p>{child.email}</p>
          </div>
        </div>
      </li>
    </div>
  );
};

export default BoxElement;

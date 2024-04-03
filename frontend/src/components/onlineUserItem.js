import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import avatar2 from "../assets/images/users/avatar-2.jpg";
import API from "../helpers/api";
import { useDispatch, useSelector } from "react-redux";
import config from "../config";
import { userActiveChat } from "../redux/slice.auth";

const OnlineUserItem = ({ id }) => {
  const token = useSelector((state) => state.user.token);
  const [profile, setProfile] = useState(null);
  const dispatch = useDispatch();
  const apiInstance = new API();
  const fetchDetails = async () => {
    const response = await apiInstance.getWithToken(`/user/${id}`, token);
    if (response.status) {
      const profileData = response.message.data;
      setProfile(profileData);
    }
  };

  const handleClick=()=>{
    dispatch(userActiveChat({
      activeChat:profile
    }))

  }
  useEffect(() => {
    fetchDetails();
  }, []);
  return (
    profile && (
      <div key={id} className="item">
        <Link to="#" onClick={handleClick} className="user-status-box">
          {/* <div className="avatar-xs mx-auto d-block chat-user-img online">
                <img
                  src={avatar2}
                  alt="user-img"
                  className="img-fluid rounded-circle"
                />
                <span className="user-status"></span>
              </div> */}
          {profile.profilePath ? (
            <div className="avatar-xs mx-auto d-block chat-user-img online">
              <img
                src={`${config.BASE_URL}${profile.profilePath}`}
                className="rounded-circle avatar-xs"
                alt="pic"
              />
              <span className="user-status"></span>
            </div>
          ) : (
            // <div className="avatar-xs mx-auto d-block chat-user-img online">
            <div
              className={
                "chat-user-img online avatar-xs mx-auto d-block align-self-center"
              }
            >
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                  {profile.firstName.charAt(0)}
                  {profile.lastName.charAt(0)}
                </span>
                <span className="user-status"></span>
              </div>
            </div>
          )}

          <h5 className="font-size-13 text-truncate mt-3 mb-1">
            {profile.firstName} {profile.lastName}
          </h5>
        </Link>
      </div>
    )
  );
};

export default OnlineUserItem;

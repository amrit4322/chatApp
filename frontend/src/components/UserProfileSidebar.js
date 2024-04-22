import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Button, Card, Badge } from "reactstrap";

//Simple bar
import SimpleBar from "simplebar-react";

//components
import AttachedFiles from "./AttachedFiles";
import CustomCollapse from "./CustomCollapse";

//actions

//i18n
import { useTranslation } from "react-i18next";

//image
import avatar7 from "../assets/images/users/avatar-7.jpg";
import { usersetSideBar } from "../redux/slice.auth";
import config from "../config";

const  UserProfileSidebar=(props) =>{
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [files] = useState([
    { name: "Admin-A.zip", size: "12.5 MB", thumbnail: "ri-file-text-fill" },
    { name: "Image-1.jpg", size: "4.2 MB", thumbnail: "ri-image-fill" },
    { name: "Image-2.jpg", size: "3.1 MB", thumbnail: "ri-image-fill" },
    { name: "Landing-A.zip", size: "6.7 MB", thumbnail: "ri-file-text-fill" },
  ]);

  const dispatch = useDispatch();
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1);
    setIsOpen2(false);
    setIsOpen3(false);
  };

  const toggleCollapse2 = () => {
    setIsOpen2(!isOpen2);
    setIsOpen1(false);
    setIsOpen3(false);
  };

  const toggleCollapse3 = () => {
    setIsOpen3(!isOpen3);
    setIsOpen1(false);
    setIsOpen2(false);
  };

  console.log("userrrrrrsidebarrrrrr",props.userSideBar)
  // closes sidebar
  const closeuserSidebar = () => {
    // props.closeUserSidebar();
    console.log("closing user sidebar")
    dispatch(usersetSideBar({
      userSideBar : false,
    }))
    
  };
  // useEffect(()=>{
  //   console.log("trueeeee",props.userSideBar)
  // },[props.userSideBar])
  return (
    <div
        style={{ display:"block"}}
        className="user-profile-sidebar"
      >
        

        <div className="text-center p-4 border-bottom">
        {props.activeUser.profilePath ? (
            <div className="avatar-xs mx-auto d-block chat-user-img online">
              <img
                src={`${config.BASE_URL}${props.activeUser.profilePath}`}
                className="rounded-circle avatar-xs"
                alt="pic"
              />
              <span className="user-status"></span>
            </div>
          ) : (
         
            <div
              className={
                "chat-user-img online avatar-xs mx-auto d-block align-self-center"
              }
            >
              <div className="avatar-xs">
                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                  {props.activeUser.firstName.charAt(0)}
                  {props.activeUser.lastName.charAt(0)}
                </span>
                <span className="user-status"></span>
              </div>
            </div>
          )}
          {/* <div className="mb-4 d-flex justify-content-center">
            {props.activeUser.profilePicture === "Null" ? (
              <div className="avatar-lg">
                <span className="avatar-title rounded-circle bg-soft-primary text-primary font-size-24">
                  {props.activeUser.name.charAt(0)}
                </span>
              </div>
            ) : (
              <img
                src={props.activeUser.profilePicture}
                className="rounded-circle avatar-lg img-thumbnail"
                alt="chatvia"
              />
            )}
          </div> */}

          <h5 className="font-size-16 mb-1 text-truncate">
            {props.activeUser.firstName} {props.activeUser.lastName} 
          </h5>
          <p className="text-muted text-truncate mb-1">
            {(() => {
              if(props.activeUser.isOnline ){
                return (
                  
                          <i className="ri-record-circle-fill font-size-10 text-success me-1">Active</i>
                     
                      );
              }else{
                return (
                        <i className="ri-record-circle-fill font-size-10 text-secondary me-1">InActive</i>
                      );
              }
              // switch (props.activeUser.status) {
              //   case "online":
              //     return (
              //       <>
              //         <i className="ri-record-circle-fill font-size-10 text-success me-1"></i>
              //       </>
              //     );

              //   case "away":
              //     return (
              //       <>
              //         <i className="ri-record-circle-fill font-size-10 text-warning me-1"></i>
              //       </>
              //     );

              //   case "offline":
              //     return (
              //       <>
              //         <i className="ri-record-circle-fill font-size-10 text-secondary me-1"></i>
              //       </>
              //     );

              //   default:
              //     return;
              // }
            })()}
           
          </p>
        </div>
        {/* End profile user */}

        {/* Start user-profile-desc */}
        <SimpleBar
          // style={{ maxHeight: "100%" }}
          className="p-4 user-profile-desc"
        >
          <div className="text-muted">
            <p className="mb-4">
              {props.activeUser.about? props.activeUser.about: "Hey there i am using ConnectUs"}
            </p>
          </div>

          <div id="profile-user-accordion" className="custom-accordion">
            <Card className="shadow-none border mb-2">
              {/* import collaps */}
              <CustomCollapse
                title="About"
                iconClass="ri-user-2-line"
                isOpen={isOpen1}
                toggleCollapse={toggleCollapse1}
              >
                <div>
                  <p className="text-muted mb-1">{t("Name")}</p>
                  <h5 className="font-size-14">{props.activeUser.firstName} {props.activeUser.lastName}</h5>
                </div>

                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Email")}</p>
                  <h5 className="font-size-14">{props.activeUser.email}</h5>
                </div>
                <div className="mt-4">
                  <p className="text-muted mb-1">{t("Phone Number")}</p>
                  <h5 className="font-size-14">{props.activeUser.phoneNumber}</h5>
                </div>

               

                
              </CustomCollapse>
            </Card>
            {/* End About card */}

            <Card className="mb-1 shadow-none border">
              {/* import collaps */}
              <CustomCollapse
                title="Attached Files"
                iconClass="ri-attachment-line"
                isOpen={isOpen2}
                toggleCollapse={toggleCollapse2}
              >
                {/* attached files */}
                <AttachedFiles files={files} />
              </CustomCollapse>
            </Card>

            {props.activeUser.isGroup === true && (
              <Card className="mb-1 shadow-none border">
                {/* import collaps */}
                <CustomCollapse
                  title="Members"
                  iconClass="ri-group-line"
                  isOpen={isOpen3}
                  toggleCollapse={toggleCollapse3}
                >
                  <Card className="p-2 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="chat-user-img align-self-center me-3">
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                            S
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-left">
                          <h5 className="font-size-14 mb-1">
                            {t("Sara Muller")}
                            <Badge
                              color="danger"
                              className="badge-soft-danger float-end"
                            >
                              {t("Admin")}
                            </Badge>
                          </h5>
                          {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-2 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="chat-user-img align-self-center me-3">
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                            O
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-left">
                          <h5 className="font-size-14 mb-1">
                            {t("Ossie Wilson")}
                          </h5>
                          {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-2 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="chat-avatar">
                        <img
                          src={avatar7}
                          className="rounded-circle chat-user-img avatar-xs me-3"
                          alt="chatvia"
                        />
                      </div>
                      <div>
                        <div className="text-left">
                          <h5 className="font-size-14 mb-1">
                            {t("Paul Haynes")}
                          </h5>
                          {/* <p className="text-muted font-size-13 mb-0">{member.status}</p> */}
                        </div>
                      </div>
                    </div>
                  </Card>
                </CustomCollapse>
              </Card>
            )}
          </div>
        </SimpleBar>
        {/* end user-profile-desc */}
      </div>
  );
}

const mapStateToProps = (state) => {
  const { userOnline,activeTab ,userSideBar } = state.user;
  return {userOnline, activeTab ,userSideBar};
};

export default connect(mapStateToProps)(
  UserProfileSidebar
);

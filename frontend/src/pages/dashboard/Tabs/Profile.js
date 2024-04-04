import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Card,
} from "reactstrap";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";


//i18n
import { useTranslation } from "react-i18next";
import API from "../../../helpers/api";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import withRouter from "../../../components/withRouter";
import { connect } from "react-redux";
import config from "../../../config";
const  Profile=(props)=> {
  const [isOpen, setisOpen] = useState(false);
  const profile = props.user;
  const currentImage = props.user?.profilePath ;


  const [isOpen1, setIsOpen1] = useState(true);

 
  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const toggleCollapse1 = () => {
    setIsOpen1(!isOpen1);
    
  };


  
  
  const toggleLightbox = (currentImage) => {
    setisOpen(!isOpen);
  };


  return (
    <>
      {profile &&
        <div>
          <div className="px-4 pt-4">

            <h4 className="mb-0">{t("My Profile")}</h4>
          </div>

          <div className="text-center  p-4 border-bottom">
            {currentImage ?
              <div className="mb-4">
                {console.log("currentImage ",currentImage)}
                <img
                  src={`${config.BASE_URL}${currentImage}`}

                  className="rounded-circle avatar-lg img-thumbnail"
                  alt={profile.firstName} 
                  onClick={() => toggleLightbox(currentImage)}

                />
              </div>
              :
              <div
                className={"mb-4 d-flex align-items-center justify-content-center"
                }
              >
                <div className="avatar-lg d-flex align-items-center justify-content-center rounded-circle bg-soft-primary text-primary">
                  {/* <span className="avatar-title rounded-circle bg-soft-primary text-primary"> */}
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}

                  {/* </span> */}
                </div>

              </div>
            }

            <h5 className="font-size-16 mb-1 text-truncate">
              {t(profile.firstName + " " + profile.lastName)}
            </h5>
            <p className="text-muted text-truncate mb-1">
              <i className="ri-record-circle-fill font-size-10 text-success me-1 d-inline-block"></i>{" "}
              {t("Active")}
            </p>
          </div>
          {/* End profile user  */}

          {/* Start user-profile-desc */}
          <div className="p-4 user-profile-desc">
            <div className="text-muted">
              <p className="mb-4">
                {t(
                  (profile.about) ? profile.about : "Hey there! I am using ChatMe"
                )}
              </p>
            </div>

            <div id="profile-user-accordion-1" className="custom-accordion">
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
                    <h5 className="font-size-14">{t(profile.firstName + " " + profile.lastName)}</h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">{t("Email")}</p>
                    <h5 className="font-size-14">{t(profile.email)}</h5>
                  </div>

                  <div className="mt-4">
                    <p className="text-muted mb-1">{t("Phone Number")}</p>
                    <h5 className="font-size-14">{t(profile.phoneNumber)}</h5>
                  </div>

                 
                </CustomCollapse>
              </Card>
              {/* End About card  */}


              {/* End Attached Files card  */}
            </div>
            {/* end profile-user-accordion  */}
          </div>
          {/* end user-profile-desc  */}
          {isOpen && currentImage && (
            <Lightbox
              mainSrc={currentImage}
              onCloseRequest={toggleLightbox}
              imageTitle="Project 1"
            />
          )}
        </div>
      }
    </>
  );
}



const mapStateToProps = (state) => {
  const { user } = state.user;
  return { user };
};

export default withRouter(
  connect(mapStateToProps)(Profile)
);
// export default Profile;

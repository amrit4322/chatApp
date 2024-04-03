

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Card, Button, UncontrolledDropdown, Input, Label, Form } from "reactstrap";
import { Link } from "react-router-dom";

import SimpleBar from "simplebar-react";

//Import components
import CustomCollapse from "../../../components/CustomCollapse";

//Import Images
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
//i18n
import { useTranslation } from 'react-i18next';
import API from '../../../helpers/api';
import { useDispatch, useSelector } from 'react-redux';
import { userData } from '../../../redux/slice.auth';
import config from '../../../config';

const Settings = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isOpen, setisOpen] = useState(false);
    const [showBTN, setShowBTN] = useState(false)
    const [currentImage, setcurrentImage] = useState(null);
    const [selected, setSelectedFile] = useState(null);

    const [isOpen1, setIsOpen1] = useState(true);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [profile, setProfile] = useState(false);
    const [toggleButton, setToggleButton] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        about:"",
    });
    const token = useSelector((state)=>state.user.token)
    const fileInputRef = useRef(null);
    const apiInstance = new API();
    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();
   const dispatch = useDispatch();  
    const toggleCollapse1 = () => {
        setIsOpen1(!isOpen1);
        setIsOpen2(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const toggleCollapse2 = () => {
        setIsOpen2(!isOpen2);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen4(false);
    };

    const toggleCollapse3 = () => {
        setIsOpen3(!isOpen3);
        setIsOpen1(false);
        setIsOpen2(false);
        setIsOpen4(false);
    };

    const toggleCollapse4 = () => {
        setIsOpen4(!isOpen4);
        setIsOpen1(false);
        setIsOpen3(false);
        setIsOpen2(false);
    };

    const toggle = () => setDropdownOpen(!dropdownOpen);
    const toggleEdit = () => setToggleButton(!toggleButton);

    const handleFileChange = (e) => {
        e.preventDefault();
        setcurrentImage(URL.createObjectURL(e.target.files[0]));
        setShowBTN(true)
        setSelectedFile(e.target.files[0]);
    };
    const handleInputChange = (e) => {

        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    

    const handleUpload = async (e) => {

        e.preventDefault()
        if (selected) {
            const formData = new FormData();
            formData.append('profilePicture', selected);
            const response = await apiInstance.uploadFile("/user/uploadFile", formData, token)
            if (response.status) {
                
                dispatch(userData({
                    profilePath:response.message.filePath
                }))
                setShowBTN(false);
            }


        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const response = await apiInstance.patchWithToken("/user/update", formData, token)
        if (response.status) {
            console.log("formDatatata",formData)
            dispatch(userData({ 
                user:formData
              }));
            toggleEdit()
            
        }
    }

    const fetchDetails = async () => {
        const response = await apiInstance.getWithToken("/user/email", token)
        if (response.status) {


            const profileData = response.message.data;
            setProfile(profileData)
            if (profileData.profilePath) {

                setcurrentImage(config.BASE_URL+profileData.profilePath)
            }
            setFormData({
                firstName: profileData.firstName || "",
                lastName: profileData.lastName || "",
                email: profileData.email || "",
                phoneNumber: profileData.phoneNumber || "",
                about:profileData.about || "Hey there! I am using ChatMe",
            });
        }
    }

    const toggleLightbox = (currentImage) => {
        setisOpen(!isOpen);
    };
    useEffect(() => {
        fetchDetails();
    }, [])

    const handleClickProfilePic=()=>{
        fileInputRef.current.click();
    }




    return (
        <>
            {profile && <div>
                <div className="px-4 pt-4">
                    <h4 className="mb-0">{t('Settings')}</h4>
                </div>

                <div className="text-center border-bottom p-4">
                    <div className="mb-4 profile-user">
                        {currentImage ?
                            <div className="">
                                <img
                                    src={selected ? URL.createObjectURL(selected) : currentImage}

                                    className="rounded-circle avatar-lg img-thumbnail"
                                    alt={profile.firstName}
                                    onClick={handleClickProfilePic}
                                    style={{cursor:"pointer"}}
                                />
                            </div>
                            :
                            <div
                                className={"d-flex align-items-center justify-content-center"
                                }
                            >
                                <div className="avatar-lg d-flex align-items-center justify-content-center rounded-circle bg-soft-primary text-primary">
                                    {/* <span className="avatar-title rounded-circle bg-soft-primary text-primary"> */}
                                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}

                                    {/* </span> */}
                                </div>

                            </div>
                        }


                        {/* <Button type="button" color="light" className="avatar-xs p-0 align-items-center rounded-circle profile-photo-edit"> */}
                        {/* <Form onSubmit={handleUpload} encType="multipart/form-data"> */}
                        <input
                id="profilePicture"
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                name="profilePicture"
                style={{ display: "none" }} // Hide file input
              />
              {showBTN && (
                <Button onClick={handleUpload} className="p-1 h-4">
                  Set Profile
                </Button>
              )}
            </div>
            {/* //TODO change> */}
            <h5 className="font-size-16 mb-1 text-truncate">
              {t(profile.firstName + " " + profile.lastName)}
            </h5>
            <UncontrolledDropdown
              className="ms-2"
              isOpen={dropdownOpen}
              toggle={toggle}
            >
              <DropdownToggle
                className="btn btn-light btn-sm w-sm"
                tag="button"
                onClick={toggle}
              >
                {t("Available")} <i className="mdi mdi-chevron-down"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>{t("Available")}</DropdownItem>
                <DropdownItem>{t("Busy")}</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
                {/* End profile user */}

                {/* Start User profile description */}
                <SimpleBar className="p-4 user-profile-desc mh-100">

                <div id="profile-setting-accordion" className="custom-accordion">
              <Card className="shadow-none border mb-2">
                {/* <Form onSubmit={handleSubmit}> */}
                <CustomCollapse
                  title="Personal Info"
                  isOpen={isOpen1}
                  toggleCollapse={toggleCollapse1}
                >
                  {!toggleButton ? (
                    <div className="float-end m-1">
                      <Button
                        onClick={toggleEdit}
                        color="light"
                        size="sm"
                        type="button"
                      >
                        <i className="ri-edit-fill me-1 align-middle"></i>{" "}
                        {t("Edit")}
                      </Button>
                    </div>
                  ) : (
                    <div className="float-end">
                      <Button onClick={handleSubmit} color="light" size="sm">
                        <i className="ri-save-fill me-1 align-middle"></i>{" "}
                        {t("Save")}
                      </Button>
                    </div>
                  )}
                  <div>
                    <div className="py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <h5 className="font-size-13 mb-0 text-truncate">
                            {t("First Name")}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <Input
                      type="text"
                      name="firstName"
                      disabled={!toggleButton}
                      onChange={handleInputChange}
                      className="font-size-14"
                      value={t(formData.firstName)}
                    ></Input>
                  </div>
                  <div>
                    <div className="py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <h5 className="font-size-13 mb-0 text-truncate">
                            {t("Last Name")}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <Input
                      type="text"
                      name="lastName"
                      disabled={!toggleButton}
                      onChange={handleInputChange}
                      className="font-size-14"
                      value={t(formData.lastName)}
                    ></Input>
                  </div>
                  <div className="mt-4">
                    <div className="py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <h5 className="font-size-13 mb-0 text-truncate">
                            {t("Email")}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <Input
                      type="text"
                      name="email"
                      disabled={true}
                      className="font-size-14"
                      value={t(formData.email)}
                    ></Input>
                  </div>

                  <div className="mt-4">
                    <div className="py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <h5 className="font-size-13 mb-0 text-truncate">
                            {t("Phone Number")}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <Input
                      type="text"
                      name="phoneNumber"
                      disabled={true}
                      className="font-size-14"
                      value={t(formData.phoneNumber)}
                    ></Input>
                  </div>
                  <div className="mt-4">
                    <div className="py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <h5 className="font-size-13 mb-0 text-truncate">
                            {t("About")}
                          </h5>
                        </div>
                      </div>
                    </div>
                    <Input
                      type="text"
                      name="about"
                      disabled={!toggleButton}
                      onChange={handleInputChange}
                      className="font-size-14"
                      value={t(formData.about)}
                    ></Input>
                  </div>
                </CustomCollapse>
                {/* </Form> */}
              </Card>
                        {/* end profile card */}

                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="Privacy"
                                isOpen={isOpen2}
                                toggleCollapse={toggleCollapse2}
                            >

                                <div className="py-3">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Profile photo')}</h5>
                                        </div>
                                        <UncontrolledDropdown className="ms-2">
                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Last seen')}</h5>

                                        </div>
                                        <div className="ms-2">
                                            <div className="form-check form-switch">
                                                <Input type="checkbox" className="form-check-input" id="privacy-lastseenSwitch" defaultChecked />
                                                <Label className="form-check-label" htmlFor="privacy-lastseenSwitch"></Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Status')}</h5>

                                        </div>
                                        <UncontrolledDropdown className="ms-2">
                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>

                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Read receipts')}</h5>

                                        </div>
                                        <div className="ms-2">
                                            <div className="form-check form-switch">
                                                <Input type="checkbox" className="form-check-input" id="privacy-readreceiptSwitch" defaultChecked />
                                                <Label className="form-check-label" htmlFor="privacy-readreceiptSwitch"></Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-3 border-top">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Groups')}</h5>

                                        </div>
                                        <UncontrolledDropdown className="ms-2">
                                            <DropdownToggle className="btn btn-light btn-sm w-sm" tag="button">
                                                {t('Everyone')} <i className="mdi mdi-chevron-down"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                <DropdownItem>{t('Everyone')}</DropdownItem>
                                                <DropdownItem>{t('selected')}</DropdownItem>
                                                <DropdownItem>{t('Nobody')}</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                            </CustomCollapse>
                        </Card>
                        {/* end Privacy card */}

                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="Security"
                                isOpen={isOpen3}
                                toggleCollapse={toggleCollapse3}
                            >

                                <div>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="font-size-13 mb-0 text-truncate">{t('Show security notification')}</h5>

                                        </div>
                                        <div className="ms-2 me-0">
                                            <div className="form-check form-switch">
                                                <Input type="checkbox" className="form-check-input" id="security-notificationswitch" />
                                                <Label className="form-check-label" htmlFor="security-notificationswitch"></Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CustomCollapse>
                        </Card>
                        {/* end Security card */}

                        <Card className="shadow-none border mb-2">
                            <CustomCollapse
                                title="Help"
                                isOpen={isOpen4}
                                toggleCollapse={toggleCollapse4}
                            >

                                <div>
                                    <div className="py-3">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('FAQs')}</Link></h5>
                                    </div>
                                    <div className="py-3 border-top">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('Contact')}</Link></h5>
                                    </div>
                                    <div className="py-3 border-top">
                                        <h5 className="font-size-13 mb-0"><Link to="#" className="text-body d-block">{t('Terms & Privacy policy')}</Link></h5>
                                    </div>
                                </div>
                            </CustomCollapse>
                        </Card>
                        {/* end Help card */}
                    </div>
                    {/* end profile-setting-accordion */}
                </SimpleBar>
                {/* End User profile description */}
                {isOpen && currentImage && (
                    <Lightbox
                        mainSrc={currentImage}
                        onCloseRequest={toggleLightbox}
                        imageTitle="Profile Picture"
                    />
                )}
            </div>}
        </>

    );
}

export default Settings;
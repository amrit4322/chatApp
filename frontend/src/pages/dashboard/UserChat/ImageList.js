import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Link } from "react-router-dom";

//i18n
import { useTranslation } from "react-i18next";

//lightbox

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import config from "../../../config";

const ImageList=({images})=> {
  const [isOpen, setisOpen] = useState(false);
  const [currentImage, setcurrentImage] = useState(null);
  const [image] = useState([JSON.parse(images)] || []);


  /* intilize t variable for multi language implementation */
  const { t } = useTranslation();

  const toggleLightbox = (currentImage) => {
    setisOpen(!isOpen);
    setcurrentImage(currentImage);
  };

  return (
    <ul className="list-inline message-img  mb-0">
        {/* image list */}
        {image.map((imgMsg, key) => (
          <li key={key} className="list-inline-item message-img-list">
            <div>
              <Link
                to="#"
                onClick={() => toggleLightbox(`${config.BASE_URL}${imgMsg.name}`)}
                className="popup-img d-inline-block m-1"
                title="Project 1"
              >
                {console.log("imgmasjdf",`${config.BASE_URL}${imgMsg.name}`)}
                <img src={`${config.BASE_URL}${imgMsg.name}`} alt="chat" className="rounded border" />
              </Link>
            </div>
            <div className="message-img-link">
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <Link to="#">
                    <i className="ri-download-2-line"></i>
                  </Link>
                </li>
                <UncontrolledDropdown tag="li" className="list-inline-item">
                  <DropdownToggle tag="a">
                    <i className="ri-more-fill"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem>
                      {t("Copy")}{" "}
                      <i className="ri-file-copy-line float-end text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      {t("Save")}{" "}
                      <i className="ri-save-line float-end text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      {t("Forward")}{" "}
                      <i className="ri-chat-forward-line float-end text-muted"></i>
                    </DropdownItem>
                    <DropdownItem>
                      {t("Delete")}{" "}
                      <i className="ri-delete-bin-line float-end text-muted"></i>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </ul>
            </div>
          </li>
        ))}

        {isOpen && (
          <Lightbox
            mainSrc={currentImage}
            onCloseRequest={toggleLightbox}
            imageTitle="Project 1"
          />
        )}
      </ul>
  );
}

export default ImageList;

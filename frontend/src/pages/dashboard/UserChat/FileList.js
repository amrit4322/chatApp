import React, { useState } from "react";
import {
  Card,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, json } from "react-router-dom";

//i18n
import { useTranslation } from "react-i18next";
import API from "../../../helpers/api";
import { useSelector } from "react-redux";

const FileList = ({ file }) => {
  console.log("file 22222222222", file);

  const apiInstance = new API();
  const token = useSelector((state) => state.user.token);

  let fileData = JSON.parse(file);
  fileData.size = formatFileSize(fileData.size);

  // fileData.size = formatFileSize(fileData.size)
  console.log("file ssssssss", fileData);
  /* intilize t variable for multi language implementation */
  function formatFileSize(sizeInBytes) {
    if (sizeInBytes >= 1024 * 1024) {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
    } else if (sizeInBytes >= 1024) {
      return (sizeInBytes / 1024).toFixed(2) + " KB";
    } else {
      return sizeInBytes + " bytes";
    }
  }
  const { t } = useTranslation();
  const download = async (imageUrl, event) => {
    event.preventDefault();
    const trimmedPath = imageUrl.substring(8);
    console.log("this is clikecedddd", trimmedPath, token);
    try {
      const response = await apiInstance.download(
        `/chat/download/${trimmedPath}`,
        token
      );
      console.log("Respnsfoinsdfn", response);
      if (response.status) {
        const url = window.URL.createObjectURL(new Blob([response.message]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", imageUrl.split("/").pop());
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading the image", error);
    }
  };

  return (
    <Card className="p-2 mb-2">
      <div className="d-flex align-items-center">
        <div className="avatar-sm me-3 ms-0">
          <div className="avatar-title bg-soft-primary text-primary rounded font-size-20">
            <i className="ri-file-text-fill"></i>
          </div>
        </div>
        <div className="flex-grow-1">
          <div className="text-start">
            <h5 className="font-size-14 mb-1">{fileData.name}</h5>
            <p className="text-muted font-size-13 mb-0">{fileData.size}</p>
          </div>
        </div>

        <div className="ms-4">
          <ul className="list-inline mb-0 font-size-20">
            <li className="list-inline-item">
              <Link
                to="#"
                onClick={(e) => download(fileData.name, e)}
                className="text-muted"
              >
                <i className="ri-download-2-line"></i>
              </Link>
            </li>
            <UncontrolledDropdown tag="li" className="list-inline-item">
              <DropdownToggle tag="a" className="dropdown-toggle text-muted">
                <i className="ri-more-fill"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>
                  {t("Share")}{" "}
                  <i className="ri-share-line float-end text-muted"></i>
                </DropdownItem>
                <DropdownItem>
                  {t("Delete")}{" "}
                  <i className="ri-delete-bin-line float-end text-muted"></i>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default FileList;

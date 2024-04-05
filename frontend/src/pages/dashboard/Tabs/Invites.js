import React, { useEffect, useState } from "react";
import { Button, Input, InputGroup, UncontrolledTooltip } from "reactstrap";
import API from "../../../helpers/api";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../config";
import { userAccepted, userNotification, userUpdateContacts } from "../../../redux/slice.auth";
import { socket } from "../../../helpers/socket";


const Invites = () => {
  const [contacts, setContacts] = useState([]);
  const inviteAccepted = useSelector((state)=>state.user.inviteAccepted)
  const notification = useSelector((state) => state.user.notification);
  const updateInvites = useSelector((state)=>state.user.updateInvites)
  const apiInstance = new API();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  useEffect(() => {
    fetchContacts();
    // if(updateInvites){
    //   fetchContacts()
    // }
   
  }, [updateInvites]);



  const fetchContacts = async () => {
    try {
      const response = await apiInstance.getWithToken(
        "/contact/fetchInvites",
        token
      );
      if (response.status) {
        console.log("fetchhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",response.message.data.length)
        setContacts(response.message.data);
        dispatch(
          userNotification({
            notification: response.message.data.length,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const removeNotification = (notificationId) => {
    dispatch(userAccepted({
      inviteAccepted: inviteAccepted.filter((_,ind) => {
        console.log("testtttttttttttttttttttt",ind,notificationId)
        return ind !== notificationId})
    }));
   
  };
  const handleIgnore = (contactId) => {
    // Handle ignore action
  };

  const handleAccept = async (contactemail) => {
    // Handle accept action
    let obj = {
      senderEmail: contactemail,
    };
    const response = await apiInstance.postWithToken(
      "/contact/connect",
      obj,
      token
    );
    if (response.status) {
      dispatch(userUpdateContacts({
        updateContacts:true,
      }))
     
      setTimeout(()=>{
        dispatch(userUpdateContacts({
          updateContacts:false,
        }))
      },1000)
      fetchContacts();
    }
  };

  return (
    <div>
      <div className="p-4">
        <h4 className="mb-4">Notifications</h4>

        <div className="search-box chat-search-box">
          <InputGroup size="lg" className="mb-3 rounded-lg">
            <span className="input-group-text text-muted bg-light pe-1 ps-3">
              <i className="ri-search-line search-icon font-size-18"></i>
            </span>
            <Input
              type="text"
              className="form-control bg-light"
              placeholder="Search Invites"
            />
          </InputGroup>
        </div>
        {contacts && notification > 0 ? (
          <div>
            <ul className="list-unstyled contact-list">
              {contacts?.map((contact) => (
                <li key={contact.id}>
                  <div className="d-flex align-items-center">
                    {contact.profilePath ? (
                      <div
                        className={
                          "chat-user-img " + " align-self-center me-3 ms-0"
                        }
                      >
                        <img
                          src={`${config.BASE_URL}${contact.profilePath}`}
                          className="rounded-circle avatar-xs"
                          alt="pic"
                        />
                      </div>
                    ) : (
                      <div
                        className={
                          "chat-user-img " + " align-self-center me-3 ms-0"
                        }
                      >
                        <div className="avatar-xs">
                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                            {contact.firstName.charAt(0)}
                            {contact.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                      <div className="mr-3">
                        <h5 className="font-size-14 m-0">
                          {contact.firstName} {contact.lastName}
                        </h5>
                        <p>{contact.email}</p>
                      </div>
                      <div>
                        <Button
                          color="secondary"
                          className="btn-sm me-2"
                          onClick={() => handleIgnore(contact.email)}
                        >
                          Ignore
                        </Button>
                        <Button
                          color="primary"
                          className="btn-sm"
                          onClick={() => handleAccept(contact.email)}
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <span>No new invites</span>
          </div>
        )}
        <hr></hr>
        {inviteAccepted?.length>0 && 
        <div>
          {inviteAccepted.map((item,id)=>
          <div key={id} className="notification bg-light p-3 mb-3 d-flex justify-content-between align-items-center">
          <span className="text-dark">{item}</span>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => removeNotification(id)}
          >
            Remove
          </button>
        </div>
          )}
          </div>}
       
       
      </div>
    </div>
  );
};



export default Invites;

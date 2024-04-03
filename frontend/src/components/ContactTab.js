import React, { Component } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import config from '../config';
import { useDispatch } from 'react-redux';
import { userActiveChat } from '../redux/slice.auth';

const ContactTab = ({ keys, contact, t,handleRemove }) => {
    const dispatch = useDispatch();
    const handleRemoveClick = (contactId) => {
        // Call the handleRemove function with the contactId as parameter
        handleRemove(contactId);
    };

    const handleClick=(child)=>{
        dispatch(userActiveChat({
          activeChat:child
        }))
    
      }
    return (

        <div key={keys} className={keys + 1 === 1 ? "" : "mt-3"}>
            <div className="p-3 fw-bold text-primary">
                {contact.group}
            </div>

            <ul className="list-unstyled contact-list">
                {
                    contact.children.map((child) =>
                        <li key={child.id}  onClick={()=>handleClick(child)}>


                            <div className="d-flex align-items-center">
                                {child.profilePath ? (
                                    <div
                                        className={
                                            "chat-user-img " +
                                            " align-self-center me-3 ms-0"
                                        }
                                    >
                                        <img
                                            src={`${config.BASE_URL}${child.profilePath}`}
                                            className="rounded-circle avatar-xs"
                                            alt="pic"
                                        />

                                    </div>
                                ) : (

                                    <div
                                        className={
                                            "chat-user-img " +
                                            " align-self-center me-3 ms-0"
                                        }
                                    >
                                        <div className="avatar-xs">
                                            <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                {child.firstName.charAt(0)}{child.lastName.charAt(0)}

                                            </span>
                                        </div>

                                    </div>)}

                                <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                                    <div className="mr-3">
                                        <h5 className="font-size-14 m-0">{child.firstName} {child.lastName}</h5>
                                        <p>{child.email}</p>
                                    </div>



                                    
                                        <UncontrolledDropdown>
                                            <DropdownToggle tag="a" className="text-muted">
                                                <i className="ri-more-2-fill"></i>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-end">
                                                {/* <DropdownItem>{t('Share')} <i className="ri-share-line float-end text-muted"></i></DropdownItem> */}
                                                <DropdownItem>{t('Block')} <i className="ri-forbid-line float-end text-muted"></i></DropdownItem>
                                                <DropdownItem onClick={() => handleRemoveClick(child.email)}>{t('Remove')} <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                    </div>
                                </li>
                                )
                                        }
                            </ul>
                        </div>


                    )
                }

                export default ContactTab;

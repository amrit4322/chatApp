import React, { Component } from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, Input, Label, UncontrolledDropdown } from 'reactstrap';

const ContactComponent = ({ keys, contact ,handleContactSelection,selectedContacts}) => {
    const toggleContactSelection = (e) => {
        const contactId = e.target.value;
        const isChecked = e.target.checked;

        if (isChecked) {
            // Add the contact ID to the array
            handleContactSelection([...selectedContacts, contactId]);
        } else {
            // Remove the contact ID from the array
            handleContactSelection(selectedContacts.filter(id => id !== contactId));
        }
      };
    return (

        <div key={keys} className={keys + 1 === 1 ? "" : "mt-3"}>
            <div className="p-3 fw-bold text-primary">
                {contact.group}
            </div>
            
            <ul className="list-unstyled contact-list">
                {
                    contact.children.map((child, key) =>
                    // onChange={(e) => handleCheck(e, child.id)}
                        <li key={child.id} >
                            <Input type="checkbox" checked={selectedContacts.includes(child.email)} className="form-check-input" onChange={toggleContactSelection} id={child.id} value={child.email} />
                                                <Label className="form-check-label" htmlFor={child.id}>
                            <div className="d-flex align-items-center">
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

                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="font-size-14 m-0">{child.firstName} {child.lastName}</h5>
                                    <p>{child.email}</p>
                                </div>
                                {/* <UncontrolledDropdown>
                                                            <DropdownToggle tag="a" className="text-muted">
                                                                <i className="ri-more-2-fill"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu className="dropdown-menu-end">
                                                                <DropdownItem>{t('Share')} <i className="ri-share-line float-end text-muted"></i></DropdownItem>
                                                                <DropdownItem>{t('Block')} <i className="ri-forbid-line float-end text-muted"></i></DropdownItem>
                                                                <DropdownItem>{t('Remove')} <i className="ri-delete-bin-line float-end text-muted"></i></DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown> */}
                            </div>
                            </Label>
                        </li>
                    )
                }
            </ul>
        </div>


    )
}

export default ContactComponent;
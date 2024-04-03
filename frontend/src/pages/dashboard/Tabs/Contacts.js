import React, {  useEffect, useState } from 'react';
import {  Button, UncontrolledTooltip, Input, InputGroup, } from 'reactstrap';
import SimpleBar from "simplebar-react";


import { withTranslation } from 'react-i18next';
import ContactTab from '../../../components/ContactTab';
import AddContactModal from '../../../components/AddContactModal';

import { APIClient } from '../../../helpers/apiClient';
import API from '../../../helpers/api';
import { socket } from '../../../helpers/socket';
import { useSelector } from 'react-redux';
//use sortedContacts variable as global variable to sort contacts
let sortedContacts = [
    {
        group: "A",
        children: [{ name: "Demo" }]
    }
]

const Contacts = ({ t }) => {
    const [modal, setModal] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [allcontacts, setFetchContacts] = useState([]);
    const [searchValue, setSearchValue] = useState("")
    const token = useSelector((state)=>state.user.token)
    const toggle = () => {
        setModal(!modal);
    };
    const data  = useSelector((state)=>state.user.user)
    
    const apiInstance = new API();
    const fetchContacts = async () => {

        // console.log("token is",token)
        const response = await apiInstance.getWithToken("/contact/find", token)
        if (response.status) {
            const contactsData = response.message.data;
            // console.log("contacts ienfs ",contactsData)
            const sortedContacts = contactsData.sort((a, b) => {
                return a.firstName.localeCompare(b.firstName);
            });


            // console.log("sortedcontacts ",sortedContacts)
            setFetchContacts(sortedContacts);
            sortContact(sortedContacts);
        }
    }

    const searchContacts = () => {
        const filteredContacts = allcontacts
            ?.filter(item =>
                item.firstName?.toLowerCase().includes(searchValue.toLowerCase())
            );
        sortContact(filteredContacts)
    }

    const handleRemove=async(contactId)=>{
            let obj = {
                receiverEmail:contactId
              }
              const response = await apiInstance.postWithToken("/contact/remove",obj,token);
              if(response.status){
                fetchContacts()
              }
    }



    useEffect(() => {
        fetchContacts();
        if (data.id) {
            socket.emit("login", data.id)
        }
        return () => {
            socket.off("login", data.id)
        }

    }, []);



    useEffect(() => {
        searchContacts();
    }, [searchValue])

    const sortContact = (contactsData) => {
        let data = contactsData.reduce((r, e) => {
            try {
                let group = e.firstName[0];
                if (!r[group]) r[group] = { group, children: [e] };
                else r[group].children.push(e);
            } catch (error) {
                return sortedContacts;
            }
            return r;
        }, {});
        let result = Object.values(data);
        setContacts(result);
        sortedContacts = result;
        return result;
    };



    return (

        <div>
            <div className="p-4">
                <div className="user-chat-nav float-end">
                    <div id="add-contact">
                        {/* Button trigger modal */}
                        <Button type="button" color="link" onClick={toggle} className="text-decoration-none text-muted font-size-18 py-0">
                            <i className="ri-user-add-line"></i>
                        </Button>
                    </div>
                    <UncontrolledTooltip target="add-contact" placement="bottom">
                        Add Contact
                    </UncontrolledTooltip>
                </div>
                <h4 className="mb-4">Contacts</h4>

                {/* Start Add contact Modal */}

                <AddContactModal t={t} isOpen={modal} toggle={toggle} />
                {/* End Add contact Modal */}

                <div className="search-box chat-search-box">
                    <InputGroup size="lg" className="bg-light rounded-lg">
                        <Button color="link" className="text-decoration-none text-muted pr-1" type="button">
                            <i className="ri-search-line search-icon font-size-18"></i>
                        </Button>
                        <Input type="text" className="form-control bg-light " placeholder={t('Search users..')} onChange={(e) => setSearchValue(e.target.value)} />
                    </InputGroup>
                </div>
                {/* End search-box */}
            </div>
            {/* end p-4 */}

            {/* Start contact lists */}
            <SimpleBar style={{ maxHeight: "100%" }} id="chat-room" className="p-4 chat-message-list chat-group-list">

                {
                    contacts.map((contact, key) =>
                        <ContactTab key={key} keys={key} contact={contact} t={t} handleRemove={handleRemove} />
                    )
                }

            </SimpleBar>
            {/* end contact lists */}
        </div>
    );
}


// const mapStateToProps = (state) => {
//     const { contacts } = state.Chat;
//     return { contacts };
// };

export default withTranslation()(Contacts);
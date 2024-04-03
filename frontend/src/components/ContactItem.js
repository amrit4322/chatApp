import React, {  useEffect, useState } from 'react';
import {  Button, Input, InputGroup, } from 'reactstrap';
import SimpleBar from "simplebar-react";


import { withTranslation } from 'react-i18next';

import ContactComponent from './ContactComponent';


//use sortedContacts variable as global variable to sort contacts
let sortedContacts = [
    {
        group: "A",
        children: [{ name: "Demo" }]
    }
]

const ContactItems= ({ t,allcontacts,setSelectedContacts,selectedContacts }) => {
    const [contacts, setContacts] = useState([]);
   
    const [searchValue, setSearchValue] = useState("")
   
  
    const handleContactSelection=(value)=>{
        setSelectedContacts(value)
       
    }

    const searchContacts = () => {
        const filteredContacts = allcontacts
            ?.filter(item =>
                item.firstName?.toLowerCase().includes(searchValue.toLowerCase())
            );
        sortContact(filteredContacts)
    }




    useEffect(() => {
        sortContact(allcontacts);
       

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
            <SimpleBar style={{ maxHeight: "250px" }} id="chat-room" className="p-4 chat-message-list chat-group-list">

                {
                    contacts.map((contact, key) =>
                        <ContactComponent keys={key} contact={contact} handleContactSelection={handleContactSelection} selectedContacts={selectedContacts} />
                    )
                }

            </SimpleBar>
            {/* end contact lists */}
        </div>
    );
}




export default withTranslation()(ContactItems);
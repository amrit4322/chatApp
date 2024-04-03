import React, { Component, useEffect, useState } from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import MultiselectCheckboxes from 'react-multiselect-checkboxes';
import API from '../helpers/api';
import ContactItems from './ContactItem';
import { useSelector } from 'react-redux';
const AddContactModal = ({ t, isOpen, toggle }) => {
    const [emailData, setEmailData] = useState([]); // State variable to hold email data fetched from API
    const [selectedContacts, setSelectedContacts] = useState([])
    const [text,setText] = useState("")

    const apiInstance = new API();
     const token = useSelector((state)=>state.user.token)

    const handleInvitation=async ()=>{
        let obj = {text:text,emails:selectedContacts}
        let response = await apiInstance.postWithToken("/contact/invite",obj,token);
        if(response.status){
        setSelectedContacts([])
        setText("")
        toggle();
        }
    }


    const handleChangeText=(e)=>{
        setText(e.target.value)

    }
    useEffect(() => {
        // Fetch email data from API using useEffect
        // Example: Replace the fetchEmailData function with your actual API call
        const fetchEmailData = async () => {
            try {
                const response = await apiInstance.getWithToken("/contact/newContact/", token)

                if (response.status) {


                    const data = response.message.data;
                    setEmailData(data);
                }
                // setEmailData(data); // Set email data in state
            } catch (error) {
                console.error('Error fetching email data:', error);
            }
        };

        fetchEmailData(); // Call fetchEmailData function
    }, []);

    useEffect(() => {
        
    }, [selectedContacts])


    // Function to handle selection of emails
    

    return (
        (emailData.length > 0 &&
            <Modal isOpen={isOpen} centered toggle={toggle}>
                <ModalHeader tag="h5" className="font-size-16" toggle={toggle}>
                    {t('Add Contacts')}
                </ModalHeader>
                <ModalBody className="p-4">
                    <Form>
                        <div className="mb-4" style={{

                            height: 400,
                            padding: '8px',
                            minWidth: 400,

                        }}>
                            <Label className="form-label" htmlFor="addcontactemail-input">{t('Select contact')}</Label>
                            <ContactItems allcontacts={emailData} selectedContacts={selectedContacts} setSelectedContacts={setSelectedContacts} />
                            {/* <Input type="email" className="form-control" id="addcontactemail-input" placeholder="Enter Email" /> */}
                        </div>
                        <div>
                            <Label className="form-label" htmlFor="addcontact-invitemessage-input">{t('Invatation Message')}</Label>
                            <textarea className="form-control" id="addcontact-invitemessage-input" rows="3" onChange={handleChangeText} value={text} placeholder="Enter Message"></textarea>
                        </div>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color="link" onClick={toggle}>Close</Button>
                    {selectedContacts.length > 0 && <Button onClick={handleInvitation} type="button" color="primary">Invite Contact</Button>}
                </ModalFooter>
            </Modal>
        )
    )

}

export default AddContactModal;
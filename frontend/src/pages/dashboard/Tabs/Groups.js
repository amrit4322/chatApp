import React, { Component, useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, UncontrolledTooltip, Form, Label, Input, Collapse, CardHeader, CardBody, Alert, InputGroup, Card, Badge } from 'reactstrap';
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";

import { withTranslation } from 'react-i18next';

//simple bar
import SimpleBar from "simplebar-react";

//components
import SelectContact from "../../../components/SelectContact";

//actions
import API from '../../../helpers/api';

const Groups = ({ groups, t }) => {
    const [modal, setModal] = useState(false);
    const [isOpenCollapse, setIsOpenCollapse] = useState(false);
    const [selectedContact, setSelectedContact] = useState([]);
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [contacts, setContacts] = useState([]);
    const [sortedContacts, setSortedContacts] = useState();

    const token = useSelector((state)=>state.user.token)
    const apiInstance = new API();


    const toggle = () => {
        setModal(!modal)

    }

    const toggleCollapse = () => {
        setIsOpenCollapse(!isOpenCollapse);
    }

    const sortContact = (sortedContacts) => {
        let data = sortedContacts.reduce((r, e) => {
            try {
                let group = e.firstName[0];
                if (!r[group]) r[group] = { group, children: [e] };
                else r[group].children.push(e);
            } catch (error) {
                return sortedContacts;
            }
            return r;
        }, {});


        // since data at this point is an object, to get array of values
        // we use Object.values method
        let result = Object.values(data);
        setContacts(result);
        setSortedContacts(result);
        return result;
    };
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
            sortContact(sortedContacts);
        }
    }

    useEffect(() => {
        fetchContacts();
    }, [])
    

    const createNewGroup = () => {
        if (selectedContact.length > 2) {
            // gourpId : 5, name : "#Project-aplha", profilePicture : "Null", isGroup : true, unRead : 0, isNew : true, desc : "project related Group",
            let obj = {
                gourpId: groups.length + 1,
                name: "#" + groupName,
                profilePicture: "Null",
                isGroup: true,
                unRead: 0,
                isNew: true,
                desc: groupDesc,
                members: selectedContact
            }
            //call action for creating a group
            toggle();

        } else if (selectedContact.length === 1) {
            setMessage("Minimum 2 members required!!!");
            setIsOpenAlert(true);

        } else {
            setMessage("Please Select Members!!!");
            setIsOpenAlert(true);
        }
        setTimeout(
            function () {
                setIsOpenAlert(false);
            },3000
        );
    }

    const handleCheck = (e, contactId) => {
        let selected = selectedContact;
        let obj;
        if (e.target.checked) {
            obj = {
                id: contactId,
                name: e.target.value
            };
            selected.push(obj);
            setSelectedContact(selected)
        }
    }

    const handleChangeGroupName = (e) => {
        setGroupName(e.target.value)
    }

    const handleChangeGroupDesc = (e) => {
        setGroupDesc(e.target.value)
    }


    return (

        <div>
            <div className="p-4">
                <div className="user-chat-nav float-end">
                    <div id="create-group">
                        {/* Button trigger modal */}
                        <Button onClick={toggle} type="button" color="link" className="text-decoration-none text-muted font-size-18 py-0">
                            <i className="ri-group-line me-1"></i>
                        </Button>
                    </div>
                    <UncontrolledTooltip target="create-group" placement="bottom">
                        Create group
                    </UncontrolledTooltip>

                </div>
                <h4 className="mb-4">{t('Groups')}</h4>

                {/* Start add group Modal */}
                <Modal isOpen={modal} centered toggle={toggle}>
                    <ModalHeader tag="h5" className="modal-title font-size-14" toggle={toggle}>{t('Create New Group')}</ModalHeader>
                    <ModalBody className="p-4">
                        <Form>
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="addgroupname-input">{t('Group Name')}</Label>
                                <Input type="text" className="form-control" id="addgroupname-input" value={groupName} onChange={(e) => handleChangeGroupName(e)} placeholder="Enter Group Name" />
                            </div>
                            <div className="mb-4">
                                <Label className="form-label">{t('Group Members')}</Label>
                                <Alert isOpen={isOpenAlert} color="danger">
                                    {message}
                                </Alert>
                                <div className="mb-3">
                                    <Button color="light" size="sm" type="button" onClick={toggleCollapse}>
                                        {t('Select Members')}
                                    </Button>
                                </div>

                                <Collapse isOpen={isOpenCollapse} id="groupmembercollapse">
                                    <Card className="border">
                                        <CardHeader>
                                            <h5 className="font-size-15 mb-0">{t('Contacts')}</h5>
                                        </CardHeader>
                                        <CardBody className="p-2">
                                            <SimpleBar style={{ maxHeight: "150px" }}>
                                                {/* contacts */}
                                                <div id="addContacts">
                                                    <SelectContact contacts={contacts} handleCheck={handleCheck} />
                                                </div>
                                            </SimpleBar>
                                        </CardBody>
                                    </Card>
                                </Collapse>
                            </div>
                            <div>
                                <Label className="form-label" htmlFor="addgroupdescription-input">Description</Label>
                                <textarea className="form-control" id="addgroupdescription-input" value={groupDesc} onChange={(e) => handleChangeGroupDesc(e)} rows="3" placeholder="Enter Description"></textarea>
                            </div>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" color="link" onClick={toggle}>{t('Close')}</Button>
                        <Button type="button" color="primary" onClick={createNewGroup}>Create Group</Button>
                    </ModalFooter>
                </Modal>
                {/* End add group Modal */}

                <div className="search-box chat-search-box">
                    <InputGroup size="lg" className="bg-light rounded-lg">
                        <Button color="link" className="text-decoration-none text-muted pr-1" type="button">
                            <i className="ri-search-line search-icon font-size-18"></i>
                        </Button>
                        <Input type="text" className="form-control bg-light" placeholder="Search groups..." />
                    </InputGroup>
                </div>
                {/* end search-box */}
            </div>

            {/* Start chat-group-list */}
            <SimpleBar style={{ maxHeight: "100%" }} className="p-4 chat-message-list chat-group-list">


                <ul className="list-unstyled chat-list">
                    {
                        groups.map((group, key) =>
                            <li key={key} >
                                <Link to="#">
                                    <div className="d-flex align-items-center">
                                        <div className="chat-user-img me-3 ms-0">
                                            <div className="avatar-xs">
                                                <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                    {group.name.charAt(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="text-truncate font-size-14 mb-0">
                                                {group.name}
                                                {
                                                    group.unRead !== 0
                                                        ? <Badge color="none" pill className="badge-soft-danger float-end">
                                                            {
                                                                group.unRead >= 20 ? group.unRead + "+" : group.unRead
                                                            }
                                                        </Badge>
                                                        : null
                                                }

                                                {
                                                    group.isNew && <Badge color="none" pill className="badge-soft-danger float-end">New</Badge>
                                                }

                                            </h5>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </SimpleBar>
            {/* End chat-group-list */}
        </div>

    );
}

const mapStateToProps = (state) => {
    const { groups, userOnline } = state.user;
    return { groups, userOnline };
};

export default (connect(mapStateToProps)(withTranslation()(Groups)));
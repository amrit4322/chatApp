import React from 'react';
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";

//Import Components
import Profile from "./Tabs/Profile";
import Chats from "./Tabs/Chats";
import Groups from "./Tabs/Groups";
import Contacts from "./Tabs/Contacts";
import Settings from "./Tabs/Settings";
import Invites from './Tabs/Invites';

const ChatLeftSidebar=(props)=> {
    const activeTab = props.activeTab;
    console.log("propssssssssss",props)

    return (
        <div className="chat-leftsidebar me-lg-1">

            <TabContent activeTab={activeTab}>
                {/* Start Profile tab-pane */}
                <TabPane tabId="profile" id="pills-user">
                    {/* profile content  */}

                    <Profile />
                </TabPane>
                {/* End Profile tab-pane  */}

                {/* Start chats tab-pane  */}
                <TabPane tabId="chat" id="pills-chat">
                    {/* chats content */}
                    <Chats  />
                </TabPane>
                {/* End chats tab-pane */}

                {/* Start groups tab-pane */}
                <TabPane tabId="group" id="pills-groups">
                    {/* Groups content */}
                    <Groups />
                </TabPane>
                {/* End groups tab-pane */}

                {/* Start contacts tab-pane */}
                <TabPane tabId="contacts" id="pills-contacts">
                    {/* Contact content */}
                    <Contacts />
                </TabPane>
                {/* End contacts tab-pane */}


                {/* Start notification tab-pane */}
                <TabPane tabId="notification" id="pills-notification">
                    {/* Settings content */}
                    <Invites />
                </TabPane>
                {/* End notification tab-pane */}
                {/* Start settings tab-pane */}
                <TabPane tabId="settings" id="pills-setting">
                    {/* Settings content */}
                    <Settings />
                </TabPane>
                {/* End settings tab-pane */}


            </TabContent>
            {/* end tab content */}

        </div>
    );
}

const mapStatetoProps = state => {
    return {
        ...state.user
    };
};

export default connect(mapStatetoProps, null)(ChatLeftSidebar);
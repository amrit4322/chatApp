import React from 'react';
//Import Components
import ChatLeftSidebar from "./ChatLeftSidebar";
import UserChat from "./UserChat/";

import { connect } from "react-redux";
import API from '../../helpers/api';
import { socket } from '../../helpers/socket';

const  Index=({userOnline}) => {
    console.log("users ssssss",userOnline)
        return (
            <React.Fragment>
                {/* chat left sidebar */}
                <ChatLeftSidebar recentChatList={userOnline} />

                {/* user chat */}
                <UserChat recentChatList={userOnline} />

            </React.Fragment>
        );
    
}

const mapStateToProps = (state) => {
    const { userOnline } = state.user;
    return { userOnline };
};

export default connect(mapStateToProps, {})(Index);
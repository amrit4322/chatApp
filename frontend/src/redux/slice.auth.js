import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  userOnline: [],
  chats: [],
  recent: [],
  groups: [],
  connectedUsers: [],
  layout: "light",
  activeTab: "chat",
  activeChat: null,
  allUser: [],
  notification :0,
  inviteAccepted:[],
  updateContacts:false,
  updateInvites:false,
  connectedAudio:false,
  connectedVideo:false,
  userSideBar:false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.token = action.payload.token;
    },
    userData: (state, action) => {
      const { profilePath } = action.payload;
      if (profilePath !== undefined) {
        state.user.profilePath = profilePath;
      } else {
        state.user = { ...state.user, ...action.payload.user };
      }
    },
    userList: (state, action) => {
      state.userOnline = action.payload.userOnline;
    },
    userChats: (state, action) => {
      state.chats = action.payload.chats;
    },
    userGroups: (state, action) => {
      state.groups = action.payload.groups;
    },
    usersetSideBar: (state, action) => {
      state.userSideBar = action.payload.userSideBar;
    },
    userLayout: (state, action) => {
      state.layout = action.payload.layout;
      if (document.body) {
        document.body.setAttribute("data-layout-mode", state.layout === "light" ? "light" : "dark");
      }
    },
    userActiveTab: (state, action) => {
      state.activeTab = action.payload.activeTab;
    },
    userActiveChat: (state, action) => {
      state.activeChat = action.payload.activeChat;
    },
    userRecent: (state, action) => {
      state.recent = action.payload.recent;
    },
    userConnected: (state, action) => {
      state.connectedUsers = action.payload.connectedUsers;
    },

    userNotification: (state, action) => {
      state.notification = action.payload.notification;
    },
    userAccepted: (state, action) => {
      state.inviteAccepted = action.payload.inviteAccepted;
    },
    userUpdateContacts: (state, action) => {
      state.updateContacts = action.payload.updateContacts;
    },
    userUpdateInvites: (state, action) => {
      state.updateInvites = action.payload.updateInvites;
    },

    userAll: (state, action) => {
      state.allUser = action.payload.allUser;
    },
    userConnectedAudio: (state, action) => {
      state.connectedAudio = action.payload.connectedAudio;
    },
    userConnectedVideo: (state, action) => {
      state.connectedVideo = action.payload.connectedVideo;
    },

    logoutUser: (state) => {
      state.token = null;
      state.user = null;
      state.userOnline = [];
      state.chats = [];
      state.groups = [];
      state.layout = "light";
      state.activeTab = "chat";
      state.activeChat = null;
      state.allUser = [];
      state.recent = [];
      state.connectedUsers = [];
      state.notification = 0;
      state.inviteAccepted = [];
      state.updateInvites =false;
      state.updateContacts=false;
      state.connectedAudio= false;
      state.connectedVideo = false;
      state.userSideBar=false;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  userData,
  userList,
  userLayout,
  userActiveTab,
  userActiveChat,
  userAll,
  userRecent,
  userConnected,
  userChats,
  userGroups,
  userNotification,
  userAccepted,
  userUpdateContacts,
  userUpdateInvites,
  userConnectedAudio,
  userConnectedVideo,
  usersetSideBar,
} = userSlice.actions;

export default userSlice.reducer;

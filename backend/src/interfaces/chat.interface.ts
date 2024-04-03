interface ChatInterface{
    id:string,
    senderId:string,
    receiverId:string,
    timestamp:string,
    data:string,
    isFileMessage:boolean,
    isImageMessage:boolean,
    seen:boolean
}

interface MsgData{
    id?:string,
    author:string,
    message:string,
    timestamp:string,
    isFileMessage:boolean,
    isImageMessage:boolean,
    seen:boolean
}
export{
    ChatInterface,
    MsgData
}
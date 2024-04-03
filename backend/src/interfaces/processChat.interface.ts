interface ChatProcessInterface{
    id:string,
    senderId:string,
    receiverId:string,
    pid:string,
    data:string,
    timestamp:Date,
}


export{
    ChatProcessInterface,
}
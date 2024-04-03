interface GroupChatInterface {
    id: number;
    groupId:string;
    contactId:string;
  }

interface FindContact{
    contactId:string;
}

  export {
    GroupChatInterface,
    FindContact
  }
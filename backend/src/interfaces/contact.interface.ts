interface ContactInterFace {
    id: number;
    userId:string;
    contactId:string;
  }

interface FindContact{
    userId:string;
    contactId:string;
}
  


  export {
    ContactInterFace,
    FindContact
  }
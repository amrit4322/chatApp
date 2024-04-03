import React from 'react';
import { Input, Label } from "reactstrap";

import BoxElement from './BoxElement';

//use sortedContacts variable as global variable to sort contacts
let sortedContacts = [
    {
        group: "A",
        children: [{ id: 0, name: "Demo" }]
    }
]

const  SelectContact =({contacts,handleCheck})=>{
  
    

  


        return (

            <React.Fragment>
                {
                    contacts?.map((contact, key) =>
                        <div key={key}>
                            <div className="p-3 font-weight-bold text-primary">
                                {contact.group}
                            </div>

                            <ul className="list-unstyled contact-list">
                                {
                                    contact?.children.map((child, keyChild) =>

                                        <li key={keyChild}>
                                            <div className="form-check">
                                                <Input type="checkbox" className="form-check-input" onChange={(e) => handleCheck(e, child.id)} id={"memberCheck" + child.id} value={child.name} />
                                                <Label className="form-check-label" htmlFor={"memberCheck" + child.id}><BoxElement child={child}/></Label>
                                            </div>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    )
                }
            </React.Fragment>
        );
    
}

// const mapStateToProps = (state) => {
//     const { contacts } = state.Chat;
//     return { contacts };
// };

// export default (connect(mapStateToProps, {})(SelectContact));
export default SelectContact;
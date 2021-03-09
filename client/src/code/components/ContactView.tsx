import React from "react";

//Material-UI
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";


const ContactView = ({ state }) => (

  <form>

    <TextField margin="dense" id="contactName" label="Name" value={ state.contactName } variant="outlined"
      InputProps={{ style : { color : "#000000" } }}  style={{ width:260 }}
      disabled={ state.currentView === "contact" }
      onChange={ state.fieldChangeHandler } 
      />
    <br />
    <TextField margin="dense" id="contactEmail" label="Email" value={ state.contactEmail } variant="outlined"
      InputProps={{ style : { color:"#000000" } }}  style={{ width:520 }}
      disabled={ state.currentView === "contact" }
      onChange={ state.fieldChangeHandler } 
      />
    <br />
    { /* Hide.show buttons as appropriate.  Note that we have to use this form of onClick() otherwise the event  */ }
    { /* object would be passed to addContact() and the branching logic would fail. */ }
    { state.currentView === "contactAdd" &&
      <Button variant="contained" color="primary" size="small" style={{ marginTop:10 }}
        onClick={ state.saveContact }>
        Save
      </Button>
    }
    { state.currentView === "contactUpdate" &&
      <Button variant="contained" color="primary" size="small" style={{ marginTop:10 }}
        onClick={ state.updateContact }>
        Update
      </Button>
    }


    { (state.currentView === "contact") &&
      <Button variant="contained" color="primary" size="small" style={{ marginTop:10, marginRight:10 }}
        onClick={ state.deleteContact}>
        Delete
      </Button>
    }

    { (state.currentView === "contact") && 
      <Button variant="contained" color="primary" size="small" style={{ marginTop:10, marginRight:10 }}
      onClick={ () => state.showComposeMessage("contact") }>Send Email</Button>
    }

{ /* Additional function  */ }
    { (state.currentView === "contact" ) &&  //show when click contact
      <Button variant="contained" color="primary" size="small" style={{ marginTop:10, marginRight:10 }}
        onClick={ state.showUpdatedContact}>
        Click here to update
      </Button>
    }

  </form>

); 


export default ContactView;

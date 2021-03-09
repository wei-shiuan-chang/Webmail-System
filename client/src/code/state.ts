// App imports.
import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";


//Expert to BaseLayout
export function createState(inParentComponent) {

  return {


    
    pleaseWaitVisible : false,
    contacts : [ ],
    mailboxes : [ ],
    messages : [ ],
    currentView : "welcome",
    currentMailbox : null,

    messageID : null,
    messageDate : null,
    messageFrom : null,
    messageTo : null,
    messageSubject : null,
    messageBody : null,

    contactID : null,
    contactName : null,
    contactEmail : null,


    
    //The block that show when the client is wait for server doing something
    showHidePleaseWait : function(inVisible: boolean): void {

      this.setState({ pleaseWaitVisible : inVisible });

    }.bind(inParentComponent), 


    //Show contact when click on the item of the contact list
    showContact : function(inID: string, inName: string, inEmail: string): void {

      console.log("state.showContact()", inID, inName, inEmail);

      this.setState({ currentView : "contact", contactID : inID, contactName : inName, contactEmail : inEmail });

    }.bind(inParentComponent), 


    
    //Show ContactView to add a newcontact
    showAddContact : function(): void {

      console.log("state.showAddContact()");

      this.setState({ currentView : "contactAdd", contactID : null, contactName : "", contactEmail : "" });

    }.bind(inParentComponent), /* End showAddContact(). */

    showUpdatedContact : function(inID: string, inName: string, inEmail: string): void {

      console.log("state.showUpdatedContact()");

      this.setState({ currentView : "contactUpdate", contactName : inName, contactEmail : inEmail });

    }.bind(inParentComponent),



    
    //Show MessageView in view the message
    showMessage : async function(inMessage: IMAP.IMessage): Promise<void> {

      console.log("state.showMessage()", inMessage);

      //Get the message's content
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      const mb: String = await imapWorker.getMessageBody(inMessage.id, this.state.currentMailbox);
      this.state.showHidePleaseWait(false);

      //Update state
      this.setState({ currentView : "message",
        messageID : inMessage.id, messageDate : inMessage.date, messageFrom : inMessage.from,
        messageTo : "", messageSubject : inMessage.subject, messageBody : mb
      });

    }.bind(inParentComponent), /* End showMessage(). */


    //Show MessageView to edit
    showComposeMessage : function(inType: string): void {

      console.log("state.showComposeMessage()");

      switch (inType) {

        case "new":
          this.setState({ currentView : "compose",
            messageTo : "", messageSubject : "", messageBody : "",
            messageFrom : config.userEmail
          });
        break;

        case "reply":
          this.setState({ currentView : "compose",
            messageTo : this.state.messageFrom, messageSubject : `Re: ${this.state.messageSubject}`,
            messageBody : `\n\n---- Original Message ----\n\n${this.state.messageBody}`, messageFrom : config.userEmail
          });
        break;

        case "contact":
          this.setState({ currentView : "compose",
            messageTo : this.state.contactEmail, messageSubject : "", messageBody : "",
            messageFrom : config.userEmail
          });
        break;

      }

    }.bind(inParentComponent), 


    //

    //Add a mailbox to the list of mailboxes
    addMailboxToList : function(inMailbox: IMAP.IMailbox): void {

      console.log("state.addMailboxToList()", inMailbox);

      // Copy list.
      const cl: IMAP.IMailbox[] = this.state.mailboxes.slice(0);

      // Add new element.
      cl.push(inMailbox);

      // Update list in state.
      this.setState({ mailboxes : cl });

    }.bind(inParentComponent), 


    //Add a contact to the list of contacts
     
    addContactToList : function(inContact: Contacts.IContact): void {

      console.log("state.addContactToList()", inContact);

      //Copy list
      const cl = this.state.contacts.slice(0);

      //Add new element
      cl.push({ _id : inContact._id, name : inContact.name, email : inContact.email });

      //Update list in state
      this.setState({ contacts : cl });

    }.bind(inParentComponent), 


    //Add a message to the current mailbox
    addMessageToList : function(inMessage: IMAP.IMessage): void {

      console.log("state.addMessageToList()", inMessage);

      //Copy list
      const cl = this.state.messages.slice(0);

      //Add new element
      cl.push({ id : inMessage.id, date : inMessage.date, from : inMessage.from, subject : inMessage.subject });

      //Update list in state
      this.setState({ messages : cl });

    }.bind(inParentComponent), 


    //Clear the list of displayed messages 
    clearMessages : function(): void {

      console.log("state.clearMessages()");

      this.setState({ messages : [ ] });

    }.bind(inParentComponent), 


    
    //Set the mailbox
    setCurrentMailbox : function(inPath: String): void {

      console.log("state.setCurrentMailbox()", inPath);

      //Update state
      this.setState({ currentView : "welcome", currentMailbox : inPath });

      //Get the list of messages
      this.state.getMessages(inPath);

    }.bind(inParentComponent),


    //Get a list of messages in the current mailbox
    getMessages : async function(inPath: string): Promise<void> {

      console.log("state.getMessages()");

      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      const messages: IMAP.IMessage[] = await imapWorker.listMessages(inPath);
      this.state.showHidePleaseWait(false);

      this.state.clearMessages();
      messages.forEach((inMessage: IMAP.IMessage) => {
        this.state.addMessageToList(inMessage);
      });

    }.bind(inParentComponent), 


    
    fieldChangeHandler : function(inEvent: any): void {

      console.log("state.fieldChangeHandler()", inEvent.target.id, inEvent.target.value);

      // Enforce max length for contact name.
      if (inEvent.target.id === "contactName" && inEvent.target.value.length > 16) { return; }

      this.setState({ [inEvent.target.id] : inEvent.target.value });

    }.bind(inParentComponent), /* End fieldChangeHandler(). */


    
    saveContact : async function(): Promise<void> {

      console.log("In client: state.saveContact()", this.state.contactID, this.state.contactName, this.state.contactEmail);

      
      const cl = this.state.contacts.slice(0);

      //Save to server
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contact: Contacts.IContact =
        await contactsWorker.addContact({ name : this.state.contactName, email : this.state.contactEmail });
      this.state.showHidePleaseWait(false);

      //Add to list
      cl.push(contact);

      //Update state
      this.setState({ contacts : cl, contactID : null, contactName : "", contactEmail : "" });

    }.bind(inParentComponent), /* End saveContact(). */

    ///
    ///
    ///Additional functional
    ///
    ///
    ///*
    updateContact : async function(): Promise<void> {

      console.log("state.saveUpdate()", this.state.contactID);
      //Save to server
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      await contactsWorker.saveUpdateContact(this.state.contactID, this.state.contactName, this.state.contactEmail);
      this.state.showHidePleaseWait(false);
      const cl = this.state.contacts.slice(0);
      //update contacts list
      cl.map(async value =>{
        if(value._id == this.state.contactID){
          value.name = this.state.contactName;
          value.email = this.state.contactEmail;
        }
      }
      );
      //Update state
      this.setState({ contacts : cl, contactID : null, contactName : "", contactEmail : "" });

    }.bind(inParentComponent), 





    
    deleteContact : async function(): Promise<void> {

      console.log("state.deleteContact()", this.state.contactID);

      
      this.state.showHidePleaseWait(true);
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      await contactsWorker.deleteContact(this.state.contactID);
      this.state.showHidePleaseWait(false);

      
      const cl = this.state.contacts.filter((inElement) => inElement._id != this.state.contactID);

      
      this.setState({ contacts : cl, contactID : null, contactName : "", contactEmail : "" });

    }.bind(inParentComponent), 


    
    deleteMessage : async function(): Promise<void> {

      console.log("state.deleteMessage()", this.state.messageID);

    
      this.state.showHidePleaseWait(true);
      const imapWorker: IMAP.Worker = new IMAP.Worker();
      await imapWorker.deleteMessage(this.state.messageID, this.state.currentMailbox);
      this.state.showHidePleaseWait(false);

      
      const cl = this.state.messages.filter((inElement) => inElement.id != this.state.messageID);

      
      this.setState({ messages : cl, currentView : "welcome" });

    }.bind(inParentComponent), 


    sendMessage : async function(): Promise<void> {

      console.log("state.sendMessage()", this.state.messageTo, this.state.messageFrom, this.state.messageSubject,
        this.state.messageBody
      );

      
      this.state.showHidePleaseWait(true);
      const smtpWorker: SMTP.Worker = new SMTP.Worker();
      await smtpWorker.sendMessage(this.state.messageTo, this.state.messageFrom, this.state.messageSubject,
        this.state.messageBody
      );
      this.state.showHidePleaseWait(false);
// Update state.
      this.setState({ currentView : "welcome" });

    }.bind(inParentComponent)


  };

} 

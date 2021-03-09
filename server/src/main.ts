//p177
import path from "path"; 
import express,{ Express, NextFunction, Request, Response } from "express";
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import { IContact } from "./Contacts";
import * as code from "./HttpStatusCode";

const app: Express = express();
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "../../client/dist")));

//p179
app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
  });

//p181
//Get a list of mailboxes
app.get("/mailboxes",
    async (inRequest: Request, inResponse: Response) => {
        console.log("GET /mailboxes (1)");
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();   //listMailboxes: capture the array of IMAP.IMailbox objects it returns
            console.log("GET /mailboxes (1): Ok", mailboxes);
            inResponse.json(mailboxes).status(code.default.GetBoxListS_code);
        } catch (inError) {
            console.log("GET /mailboxes (1): Error", inError);
            inResponse.send("error").status(code.default.GetBoxListF_code);
        }
    }
);

//182
//Get a list of messages in a specific mailbox
app.get("/mailboxes/:mailbox",
  async (inRequest: Request, inResponse: Response) => {
    console.log("GET /mailboxes (2)", inRequest.params.mailbox);
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const messages: IMAP.IMessage[] = await imapWorker.listMessages({   //listMessages: get an array of IAP.IMessage objects
        mailbox : inRequest.params.mailbox
      });
      console.log("GET /mailboxes (2): Ok", messages);
      inResponse.json(messages).status(code.default.GetMessageListS_code);
    } catch (inError) {
      console.log("GET /mailboxes (2): Error", inError);
      inResponse.send("error").status(code.default.GetMessageListF_code);
    }
  }
);

//p183
//Get the body contents of a specific message in a specific mailbox
app.get("/messages/:mailbox/:id",
  async (inRequest: Request, inResponse: Response) => {
    console.log("GET /messages (3)", inRequest.params.mailbox, inRequest.params.id);
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const messageBody: string = await imapWorker.getMessageBody({   //getMessageBody: get a string(the content of the message)
        mailbox : inRequest.params.mailbox,
        id : parseInt(inRequest.params.id, 10)
      });
      console.log("GET /messages (3): Ok", messageBody);
      inResponse.send(messageBody);
    } catch (inError) {
      console.log("GET /messages (3): Error", inError);
      inResponse.send("error");
    }
  }
);

//p184
//Delete a message
app.delete("/messages/:mailbox/:id",
  async (inRequest: Request, inResponse: Response) => {
    console.log("DELETE /messages");
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      await imapWorker.deleteMessage({                                              //deleteMessage
        mailbox : inRequest.params.mailbox,
        id : parseInt(inRequest.params.id, 10)
      });
      console.log("DELETE /messages: Ok");
      inResponse.send("ok");
    } catch (inError) {
      console.log("DELETE /messages: Error", inError);
      inResponse.send("error");
    }
  }
);

//p184
//Send a message
app.post("/messages",
  async (inRequest: Request, inResponse: Response) => {
    console.log("POST /messages", inRequest.body);
    try {
      const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
      await smtpWorker.sendMessage(inRequest.body);                                 //sendMessage
      console.log("POST /messages: Ok");
      inResponse.send("ok");
    } catch (inError) {
      console.log("POST /messages: Error", inError);
      inResponse.send("error");
    }
  }
);

//p185
//List contacts
app.get("/contacts",
  async (inRequest: Request, inResponse: Response) => {
    console.log("GET /contacts");
    try {
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contacts: IContact[] = await contactsWorker.listContacts();             //listContacts
      console.log("GET /contacts: Ok", contacts);
      inResponse.json(contacts);
    } catch (inError) {
      console.log("GET /contacts: Error", inError);
      inResponse.send("error");
    }
  }
);

//p186
//Add a contact
app.post("/contacts",
  async (inRequest: Request, inResponse: Response) => {
    console.log("POST /contacts", inRequest.body);
    try {
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      const contact: IContact = await contactsWorker.addContact(inRequest.body);    //addContact
      console.log("POST /contacts: Ok", contact);
      inResponse.json(contact);
      
    } catch (inError) {
      console.log("POST /contacts: Error", inError);
      inResponse.send("error");
    }
  }
);

//Update contact

app.post("/contacts/:id",
  async (inRequest: Request, inResponse: Response) => {
    console.log("UPDATE /contacts", inRequest.body);
    try {
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      await contactsWorker.updateContact(inRequest.params.id, inRequest.body);
      console.log("UPDATE /contacts: Ok");
      //console.log("Server-side: UPDATE /contacts: Ok");
    } catch (inError) {
      console.log(inError);
    }
  }
);

//p187
//Delete a contact
app.delete("/contacts/:id",
  async (inRequest: Request, inResponse: Response) => {
    console.log("DELETE /contacts", inRequest.body);
    try {
      const contactsWorker: Contacts.Worker = new Contacts.Worker();
      await contactsWorker.deleteContact(inRequest.params.id);                      //deleteContact
      console.log("Contact deleted");
      inResponse.send("ok");
    } catch (inError) {
      console.log(inError);
      inResponse.send("error");
    }
  }
);



app.get("/messages/:mailbox/:id",
  async (inRequest: Request, inResponse: Response) => {
    console.log("GET /messages (3)", inRequest.params.mailbox, inRequest.params.id);
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
      const messageBody: string = await imapWorker.getMessageBody({   //getMessageBody: get a string(the content of the message)
        mailbox : inRequest.params.mailbox,
        id : parseInt(inRequest.params.id, 10)
      });
      console.log("GET /messages (3): Ok", messageBody);
      inResponse.send(messageBody);
    } catch (inError) {
      console.log("GET /messages (3): Error", inError);
      inResponse.send("error");
    }
  }
);



// Start app listening.
app.listen(3250, () => {
  console.log("MailBag server open for requests");
});









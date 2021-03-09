const ImapClient = require("emailjs-imap-client");
import { ParsedMail } from "mailparser";
import { simpleParser } from "mailparser";
import { IServerInfo } from "./ServerInfo";

//Interface to describe a mailbox
export interface ICallOptions {
    mailbox: string,
    id?: number             //"?":optional
}

//Interface to describe a received message
export interface IMessage {
    id: string,
    date: string,
    from: string,
    subject: string,
    body?: string           //"?":optional, it isn't sent when listing messages
}

//Interface for a mailbox
export interface IMailbox {
    name: string,
    path: string
}

//Disable certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  
export class Worker {

private static serverInfo: IServerInfo; //static is superfluous
  
    constructor(inServerInfo: IServerInfo) {
  
      console.log("IMAP.Worker.constructor", inServerInfo);
      Worker.serverInfo = inServerInfo;
  
    }

    //Connect to the SMTP server and return a client object for operations to use
    private async connectToServer(): Promise<any> {

        // noinspection TypeScriptValidateJSTypes
        const client: any = new ImapClient.default(
          Worker.serverInfo.imap.host,
          Worker.serverInfo.imap.port,
          { auth : Worker.serverInfo.imap.auth }
        );
        client.logLevel = client.LOG_LEVEL_NONE;
        client.onerror = (inError: Error) => {
          console.log("IMAP.Worker.listMailboxes(): Connection error", inError);
        };
        await client.connect();
        console.log("IMAP.Worker.listMailboxes(): Connected");
    
        return client;
    
      }

      //List mailboxes
      public async listMailboxes(): Promise<IMailbox[]> {

        console.log("IMAP.Worker.listMailboxes()");
    
        const client: any = await this.connectToServer();
        const mailboxes: any = await client.listMailboxes();
        await client.close();
    
        //To present a flat list of mailboxes by calling iterateChildren() recursively
        const finalMailboxes: IMailbox[] = [];
        const iterateChildren: Function = (inArray: any[]): void => {
          inArray.forEach((inValue: any) => {
            finalMailboxes.push({
              name : inValue.name,
              path : inValue.path
            });
            iterateChildren(inValue.children);
          });
        };
        iterateChildren(mailboxes.children);
    
        return finalMailboxes;
    
      }

      //List messages in a named mailbox
      public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {

        console.log("IMAP.Worker.listMessages()", inCallOptions);
    
        const client: any = await this.connectToServer();
    
        //Select the mailbox first.  
        //inCallOptions: contain the name of the mailbox in its mailbox field
        //exists: gives us the message count.
        const mailbox: any = await client.selectMailbox(inCallOptions.mailbox);
        console.log(`IMAP.Worker.listMessages(): Message count = ${mailbox.exists}`);
    
        // If there are no messages then just return an empty array.
        if (mailbox.exists === 0) {
          await client.close();
          return [ ];
        }
    
        //client.listMessages: takes in the name of the mailbox, what messages to retrieve, and what properties we want
        const messages: any[] = await client.listMessages(
          inCallOptions.mailbox,
          "1:*",    //a query that determines what messages we’ll get --> beginning with the first one and all messages after it(*)
          [ "uid", "envelope" ]     //returned in order by uid, so it's FIFO
        );
    
        await client.close();
    
        //
        const finalMessages: IMessage[] = [];
        messages.forEach((inValue: any) => {
          finalMessages.push({
            id : inValue.uid,
            date: inValue.envelope.date,
            from: inValue.envelope.from[0].address,
            subject: inValue.envelope.subject
          });
        });
    
        return finalMessages;
    
      }

      public async getMessageBody(inCallOptions: ICallOptions): 
      Promise<string> {

        console.log("IMAP.Worker.getMessageBody()", inCallOptions);
        const client: any = await this.connectToServer();
    
        const messages: any[] = await client.listMessages(
          inCallOptions.mailbox,
          inCallOptions.id,
          [ "body[]" ],
          { byUid : true }
        );
        const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);   //simpleParser: parse the message into a ParsedMail object
        await client.close();
    
        return parsed.text!; /////!
    
      }

      //Delete a message
      public async deleteMessage(inCallOptions: ICallOptions): Promise<any> {

        console.log("IMAP.Worker.deleteMessage()", inCallOptions);
    
        const client: any = await this.connectToServer();
    
        await client.deleteMessages(
          inCallOptions.mailbox,
          inCallOptions.id,
          { byUid : true }
        );
    
        await client.close();
    
      }

      

}








//Library
import axios, { AxiosResponse } from "axios";

//App
import { config } from "./config";


//Interface for a mailbox
export interface IMailbox { name: string, path: string }


//Interface for a received message
export interface IMessage {
  id: string,
  date: string,
  from: string,
  subject: string,
  body?: string
}


//The worker to perform IMAP operations.
export class Worker {


  
  public async listMailboxes(): Promise<IMailbox[]> {

    console.log("IMAP.Worker.listMailboxes()");

    const response: AxiosResponse = await axios.get(`${config.serverAddress}/mailboxes`);
    return response.data;

  } 


  
  public async listMessages(inMailbox: string): Promise<IMessage[]> {

    console.log("IMAP.Worker.listMessages()");

    const response: AxiosResponse = await axios.get(`${config.serverAddress}/mailboxes/${inMailbox}`);
    return response.data;

  } 

 
  public async getMessageBody(inID: string, inMailbox: String): Promise<string> {

    console.log("IMAP.Worker.getMessageBody()", inID);

    const response: AxiosResponse = await axios.get(`${config.serverAddress}/messages/${inMailbox}/${inID}`);
    return response.data;

  } 


 
  public async deleteMessage(inID: string, inMailbox: String): Promise<void> {

    console.log("IMAP.Worker.getMessageBody()", inID);

    await axios.delete(`${config.serverAddress}/messages/${inMailbox}/${inID}`);

  } 


} 

//Library
import axios from "axios";

//App
import { config } from "./config";


//The worker to perform SMTP operations.
export class Worker {


public async sendMessage(inTo: string, inFrom: string, inSubject: string, inMessage: string): Promise<void> {

    console.log("SMTP.Worker.sendMessage()");

    await axios.post(`${config.serverAddress}/messages`, { to : inTo, from : inFrom, subject : inSubject,
      text : inMessage
    });

  } 


} 

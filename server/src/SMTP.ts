//p189
import Mail from "nodemailer/lib/mailer";
import * as nodemailer from "nodemailer";
import { SendMailOptions, SentMessageInfo } from "nodemailer";
//const nodemailer = require("nodemailer");////?

import { IServerInfo } from "./ServerInfo";

export class Worker {
    private static serverInfo: IServerInfo; //static is superfluous

    constructor(inServerInfo: IServerInfo) {

        Worker.serverInfo = inServerInfo;
    
      }

    //p193
    //Worker.sendMessage()
    public sendMessage(inOptions: SendMailOptions): 
    Promise<string> {

    //console.log("SMTP.Worker.sendMessage()", inOptions);

        return new Promise((inResolve, inReject) => {
            const transport: Mail = nodemailer.createTransport(Worker.serverInfo.smtp);         //nodemailer.createTransport()
            transport.sendMail(inOptions,                                                       //transport.sendMail(), inOptions: contains the message details passed in from the client
                (inError: Error | null, inInfo: SentMessageInfo) => {
                if (inError) {
                    //console.log("SMTP.Worker.sendMessage(): Error", inError);
                    inReject(inError);
                } else {
                    //console.log("SMTP.Worker.sendMessage(): Ok", inInfo);
                    inResolve();
                }
                }
            );
        });
    }

}



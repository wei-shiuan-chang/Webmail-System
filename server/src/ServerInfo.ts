//p187
//Import the Node path module and File System(fs) module
//to read the stored information about servers
const path = require("path");
const fs = require("fs");

//p188
//Define an interface for server information.
export interface IServerInfo {
    smtp : {
      host: string,
      port: number,
      auth: {
        user: string,
        pass: string
      }
    },
    imap : {
      host: string,
      port: number,
      auth: {
        user: string,
        pass: string
      }
    }
  }

//Declare a variable typed to that interface
export let serverInfo: IServerInfo;

//p189
//Read the serverInfo.json file in (fs.readFileSync())
//and create an object that adheres to the IServerInfo interface 
//and that the serverInfo variable points to.
const rawInfo: string = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo = JSON.parse(rawInfo);

//?
console.log("ServerInfo: ", serverInfo);

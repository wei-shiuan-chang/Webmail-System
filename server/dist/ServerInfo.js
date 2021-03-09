"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//p187
//Import the Node path module and File System(fs) module
//to read the stored information about servers
var path = require("path");
var fs = require("fs");
//p189
//Read the serverInfo.json file in (fs.readFileSync())
//and create an object that adheres to the IServerInfo interface 
//and that the serverInfo variable points to.
var rawInfo = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
exports.serverInfo = JSON.parse(rawInfo);
//?
console.log("ServerInfo: ", exports.serverInfo);
//# sourceMappingURL=ServerInfo.js.map
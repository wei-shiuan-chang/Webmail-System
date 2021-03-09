"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = __importStar(require("nodemailer"));
var Worker = /** @class */ (function () {
    function Worker(inServerInfo) {
        Worker.serverInfo = inServerInfo;
    }
    //p193
    //Worker.sendMessage()
    Worker.prototype.sendMessage = function (inOptions) {
        //console.log("SMTP.Worker.sendMessage()", inOptions);
        return new Promise(function (inResolve, inReject) {
            var transport = nodemailer.createTransport(Worker.serverInfo.smtp); //nodemailer.createTransport()
            transport.sendMail(inOptions, //transport.sendMail(), inOptions: contains the message details passed in from the client
            function (inError, inInfo) {
                if (inError) {
                    //console.log("SMTP.Worker.sendMessage(): Error", inError);
                    inReject(inError);
                }
                else {
                    //console.log("SMTP.Worker.sendMessage(): Ok", inInfo);
                    inResolve();
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
//# sourceMappingURL=SMTP.js.map
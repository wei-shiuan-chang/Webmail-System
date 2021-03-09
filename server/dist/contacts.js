"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var Datastore = require("nedb");
var Worker = /** @class */ (function () {
    function Worker() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"),
            autoload: true
        });
    }
    //p210
    //Provide a list of contacts
    Worker.prototype.listContacts = function () {
        var _this = this;
        console.log("Contacts.Worker.listContacts()");
        return new Promise(function (inResolve, inReject) {
            _this.db.find({}, function (inError, inDocs) {
                if (inError) {
                    console.log("Contacts.Worker.listContacts(): Error", inError);
                    inReject(inError);
                }
                else {
                    console.log("Contacts.Worker.listContacts(): Ok", inDocs);
                    inResolve(inDocs);
                }
            });
        });
    };
    //p211
    //Add a new contact to the collection
    Worker.prototype.addContact = function (inContact) {
        var _this = this;
        console.log("Contacts.Worker.addContact()", inContact);
        return new Promise(function (inResolve, inReject) {
            _this.db.insert(inContact, function (inError, inNewDoc) {
                if (inError) {
                    console.log("Contacts.Worker.addContact(): Error", inError);
                    inReject(inError);
                }
                else {
                    console.log("Contacts.Worker.addContact(): Ok", inNewDoc);
                    inResolve(inNewDoc);
                }
            });
        });
    };
    //p211
    //Remove a contact
    Worker.prototype.deleteContact = function (inID) {
        var _this = this;
        console.log("Contacts.Worker.deleteContact()", inID);
        return new Promise(function (inResolve, inReject) {
            _this.db.remove({ _id: inID }, {}, function (inError, inNumRemoved) {
                if (inError) {
                    console.log("Contacts.Worker.deleteContact(): Error", inError);
                    inReject(inError);
                }
                else {
                    console.log("Contacts.Worker.deleteContact(): Ok", inNumRemoved);
                    inResolve();
                }
            });
        });
    };
    //Additional function
    Worker.prototype.updateContact = function (inID, update) {
        var _this = this;
        console.log("In server: Contacts.Worker.updateContact()", inID, update);
        return new Promise(function (inResolve, inReject) {
            _this.db.update({ _id: inID }, update, {}, function (inError, inNumRemoved) {
                if (inError) {
                    console.log("Contacts.Worker.updateContact(): Error", inError);
                    inReject(inError);
                }
                else {
                    console.log("Contacts.Worker.updateContact(): Ok", inNumRemoved);
                    inResolve();
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
//# sourceMappingURL=contacts.js.map
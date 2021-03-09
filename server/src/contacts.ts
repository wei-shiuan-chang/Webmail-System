import * as path from "path";
const Datastore = require("nedb");

//p209
//Define an interface to describe a contact
export interface IContact {
    _id?: number,           //only have an _id field when retrieving or adding
    name: string,
    email: string
}

export class Worker {

    private db: Nedb;
    
    constructor() {
  
        this.db = new Datastore({
            filename : path.join(__dirname, "contacts.db"),
            autoload : true
        });
  
    }

    //p210
    //Provide a list of contacts
    public listContacts(): Promise<IContact[]> {

        console.log("Contacts.Worker.listContacts()");
    
        return new Promise((inResolve, inReject) => {
            this.db.find(
                {},
                (inError: Error, inDocs: IContact[]) => {
                    if (inError) {
                        console.log("Contacts.Worker.listContacts(): Error", inError);
                        inReject(inError);
                    } else {
                        console.log("Contacts.Worker.listContacts(): Ok", inDocs);
                        inResolve(inDocs);
                    }
                }
            );
        });
    
    } 

    //p211
    //Add a new contact to the collection
    public addContact(inContact: IContact): Promise<IContact> {

        console.log("Contacts.Worker.addContact()", inContact);
    
        return new Promise((inResolve, inReject) => {
          this.db.insert(
            inContact,
            (inError: Error | null, inNewDoc: IContact) => {        //| null
              if (inError) {
                console.log("Contacts.Worker.addContact(): Error", inError);
                inReject(inError);
              } else {
                console.log("Contacts.Worker.addContact(): Ok", inNewDoc);
                inResolve(inNewDoc);
              }
            }
          );
        });
    
    }
    

    //p211
    //Remove a contact
    public deleteContact(inID: string): Promise<string> {

        console.log("Contacts.Worker.deleteContact()", inID);
    
        return new Promise((inResolve, inReject) => {
          this.db.remove(
            { _id : inID },
            { },
            (inError: Error | null, inNumRemoved: number) => {      //| null
              if (inError) {
                console.log("Contacts.Worker.deleteContact(): Error", inError);
                inReject(inError);
              } else {
                console.log("Contacts.Worker.deleteContact(): Ok", inNumRemoved);
                inResolve();
              }
            }
          );
        });
    
      }

    //Additional function
    
public updateContact(inID: string, update:string): Promise<string> {
    console.log("In server: Contacts.Worker.updateContact()", inID, update);
    return new Promise((inResolve, inReject) => {
      this.db.update(
        { _id : inID },
        update,
        { }, 
        (inError: Error | null, inNumRemoved: number) => {      //| null
          if (inError) {
            console.log("Contacts.Worker.updateContact(): Error", inError);
            inReject(inError);
          } else {
            console.log("Contacts.Worker.updateContact(): Ok", inNumRemoved);
            inResolve();
          }
        }
      );
    });
  }
//*/

    

    

    

}

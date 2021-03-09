//Library
import axios, { AxiosResponse } from "axios";

//App
import { config } from "./config";

//Interface for a contact
export interface IContact { _id?: number, name: string, email: string }


//The worker to perform contact operations.
export class Worker {


  
  public async listContacts(): Promise<IContact[]> {

    console.log("Contacts.Worker.listContacts()");

    const response: AxiosResponse = await axios.get(`${config.serverAddress}/contacts`);
    return response.data;

  } 


  public async addContact(inContact: IContact): Promise<IContact> {

    console.log("Contacts.Worker.addContact()", inContact);

    const response: AxiosResponse = await axios.post(`${config.serverAddress}/contacts`, inContact);
    return response.data;

  } 

  //Additional function
  public async saveUpdateContact(inID:string, inName:string, inEmail:string): Promise<void> {

    console.log("In client: Contacts.Worker.updateContact()", inID);

    await axios.post(`${config.serverAddress}/contacts/${inID}`, {name: inName, email: inEmail});
    

  }


  
  public async deleteContact(inID): Promise<void> {

    console.log("Contacts.Worker.deleteContact()", inID);

    await axios.delete(`${config.serverAddress}/contacts/${inID}`);

  }

  


}

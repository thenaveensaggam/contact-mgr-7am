import {Request, Response} from "express";
import {validationResult} from "express-validator";
import {IContact} from "../db/models/IContact";
import ContactsTable from "../db/schemas/contactSchema";
import mongoose from "mongoose";

/**
 * @usage : Get all contacts
 * @method : GET
 * @url : http://localhost:9000/contacts/
 * @access : PUBLIC
 * @param request
 * @param response
 */
export const getAllContacts = async (request: Request, response: Response) => {
    try {
        const contacts: IContact[] = await ContactsTable.find();
        return response.status(200).json(contacts);
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};

/**
 * @usage : Get contact
 * @method : GET
 * @url : http://localhost:9000/contacts/:contactId
 * @access : PUBLIC
 * @param request
 * @param response
 */
export const getContact = async (request: Request, response: Response) => {
    try {
        const {contactId} = request.params;
        const mongoContactId = new mongoose.Types.ObjectId(contactId);
        const contact: IContact | undefined | null = await ContactsTable.findById(mongoContactId);
        if (!contact) {
            return response.status(404).json({msg: "Contact is not found"});
        }
        return response.status(200).json(contact);
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};


/**
 * @usage : Create a contact
 * @method : POST
 * @url : http://localhost:9000/contacts/
 * @param : name , imageUrl, mobile, email, company, title, groupId
 * @access : PUBLIC
 */
export const createContact = async (request: Request, response: Response) => {
    try {
        // validate the form
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        // read the form data
        const {name, imageUrl, mobile, email, company, title, groupId} = request.body;

        // check if the mobile exists
        const contact: IContact | undefined | null = await ContactsTable.findOne({mobile: mobile});
        if (contact) {
            return response.status(200).json({msg: "Contact is Already Exist with same mobile number!"});
        }
        // create a contact
        const theContact: IContact = {
            name: name,
            imageUrl: imageUrl,
            mobile: mobile,
            email: email,
            company: company,
            title: title,
            groupId: groupId
        };
        const createdContact: IContact | undefined | null = await new ContactsTable(theContact).save();
        if (createdContact) {
            return response.status(200).json(createdContact);
        }
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};

/**
 * @usage : Update the contact
 * @method : PUT
 * @url : http://localhost:9000/contacts/:contactId
 * @access : PUBLIC
 * @param request
 * @param response
 */
export const updateContact = async (request: Request, response: Response) => {
    try {
        // validate the form
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        const {contactId} = request.params;
        const mongoContactId = new mongoose.Types.ObjectId(contactId);

        // read the form data
        const {name, imageUrl, mobile, email, company, title, groupId} = request.body;

        // check if the contact is exists
        const contact: IContact | undefined | null = await ContactsTable.findById(mongoContactId);
        if (!contact) {
            return response.status(404).json({msg: "Contact is not found"});
        }
        // update the contact
        const theContact: IContact = {
            name: name,
            imageUrl: imageUrl,
            mobile: mobile,
            email: email,
            company: company,
            title: title,
            groupId: groupId
        };
        const updatedContact: IContact | undefined | null = await ContactsTable.findByIdAndUpdate(mongoContactId, {
            $set: theContact
        }, {new: true});
        if (updatedContact) {
            return response.status(200).json(updatedContact);
        }
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};


/**
 * @usage : Delete a contact
 * @method : DELETE
 * @url : http://localhost:9000/contacts/:contactId
 * @access : PUBLIC
 * @param request
 * @param response
 */
export const deleteContact = async (request: Request, response: Response) => {
    try {
        const {contactId} = request.params;
        const mongoContactId = new mongoose.Types.ObjectId(contactId);
        const contact: IContact | undefined | null = await ContactsTable.findById(mongoContactId);
        if (!contact) {
            return response.status(404).json({msg: "Contact is not found"});
        }
        // delete the contact
        const deletedContact: IContact | undefined | null = await ContactsTable.findByIdAndDelete(mongoContactId);
        if (deletedContact) {
            return response.status(200).json({});
        }
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};











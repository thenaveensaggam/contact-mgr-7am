import {Request, Response} from "express";
import {validationResult} from 'express-validator';
import GroupTable from "../db/schemas/groupSchema";
import {IGroup} from "../db/models/IGroup";
import mongoose from "mongoose";

/**
 * @usage : Get all groups
 * @method : GET
 * @url : http://localhost:9000/groups/
 * @access : PUBLIC
 * @param request
 * @param response
 */
export const getAllGroups = async (request: Request, response: Response) => {
    try {
        const groups: IGroup[] = await GroupTable.find();
        return response.status(200).json(groups);
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};

/**
 * @usage : Get Group
 * @method : GET
 * @url : http://localhost:9000/groups/:groupId
 * @access : PUBLIC
 * @param request
 * @param response
 */
export const getGroup = async (request: Request, response: Response) => {
    try {
        const {groupId} = request.params;
        const mongoGroupId = new mongoose.Types.ObjectId(groupId);
        const group: IGroup | undefined | null = await GroupTable.findById(mongoGroupId);
        if (!group) {
            return response.status(404).json({
                msg: 'Group is not found'
            });
        }
        return response.status(200).json(group);
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};


/**
 * @usage : Create a group
 * @method : POST
 * @url : http://localhost:9000/groups/
 * @access : PUBLIC
 * @param request
 * @param response
 */
export const createGroup = async (request: Request, response: Response) => {
    try {
        // validate the form
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        // read the form data
        const {name} = request.body;
        // check if the group exists in db
        const group: IGroup | undefined | null = await GroupTable.findOne({name: name});
        if (group) {
            return response.status(401).json({
                msg: "Group is already exists!"
            });
        }
        // create a group
        const theGroup: IGroup | undefined | null = await new GroupTable<IGroup>({name: name}).save();
        if (theGroup) {
            return response.status(200).json({
                msg: "Groups is Created",
                group: theGroup
            });
        }
    } catch (error: any) {
        return response.status(500).json({
            msg: error.message
        });
    }
};









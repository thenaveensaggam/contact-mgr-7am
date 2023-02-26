import {Response, Router, Request} from "express";
import * as groupController from "../controllers/groupController";
import {body} from 'express-validator';

const groupRoutes: Router = Router();

/**
 * @usage : Get all groups
 * @method : GET
 * @url : http://localhost:9000/groups/
 * @param : No-params
 * @access : PUBLIC
 */
groupRoutes.get('/', async (request: Request, response: Response) => {
    await groupController.getAllGroups(request, response);
})

/**
 * @usage : Get Group
 * @method : GET
 * @url : http://localhost:9000/groups/:groupId
 * @param : No-params
 * @access : PUBLIC
 */
groupRoutes.get('/:groupId', async (request: Request, response: Response) => {
    await groupController.getGroup(request, response);
})

/**
 * @usage : Create a group
 * @method : POST
 * @url : http://localhost:9000/groups/
 * @param : name
 * @access : PUBLIC
 */
groupRoutes.post('/', [
    body('name').not().isEmpty().withMessage('Name is required')
], async (request: Request, response: Response) => {
    await groupController.createGroup(request, response);
})

export default groupRoutes;


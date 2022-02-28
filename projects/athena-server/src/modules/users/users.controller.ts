import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { Request, Response, NextFunction } from 'express';

@Controller('/v1/users')
class UsersController {
    @Route({
        path: '/:id',
        httpMethod: HTTPMethods.GET,
    })
    async get(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to fetch user ${req.params.id} via /users/:id [GET].`);
    }

    @Route({
        httpMethod: HTTPMethods.POST,
    })
    async add(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to add a new user via /users [POST].`);
    }

    @Route({
        path: '/:id',
        httpMethod: HTTPMethods.PATCH,
    })
    async update(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to update user ${req.params.id} via /users/:id [PATCH].`);
    }

    @Route({
        path: '/:id',
        httpMethod: HTTPMethods.DELETE,
    })
    async delete(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to delete user ${req.params.id} via /users/:id [DELETE].`);
    }
}

export default UsersController;

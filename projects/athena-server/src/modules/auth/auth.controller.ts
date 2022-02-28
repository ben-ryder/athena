import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { Request, Response, NextFunction } from 'express';

@Controller('/v1/auth')
class AuthController {
    @Route({
        path: '/login',
        httpMethod: HTTPMethods.POST,
    })
    async login(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to login via /auth/login [POST].`);
    }

    @Route({
        path: '/logout',
        httpMethod: HTTPMethods.POST,
    })
    async logout(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to log out via /auth/logout [POST].`);
    }

    @Route({
        path: '/check',
        httpMethod: HTTPMethods.POST,
    })
    async check(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to check a user via /auth/check [POST].`);
    }
}

export default AuthController;

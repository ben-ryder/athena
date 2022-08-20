import { Controller, Route, HTTPMethods } from '@kangojs/core';
import { Request, Response, NextFunction } from 'express';
import {ConfigService} from "../../services/config/config";
import {InfoDto} from "@ben-ryder/athena-js-lib";


@Controller({
    path: '/v1/info',
    identifier: "info-controller",
})
export class InfoController {
    constructor(
      private configService: ConfigService
    ) {}

    @Route({
        httpMethod: HTTPMethods.GET,
        authRequired: false
    })
    async info(req: Request, res: Response, next: NextFunction) {
        const meta: InfoDto = {
            version: "v1",
            registration: this.configService.config.app.registrationEnabled
        }

        return res.send(meta)
    }
}

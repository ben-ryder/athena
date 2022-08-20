import {Controller, HTTPMethods, HTTPStatusCodes, Route} from '@kangojs/core';
import {TestingEnabledMiddleware} from "./testing-enabled.middleware";
import {NextFunction, Request, Response} from "express";
import {resetTestData} from "@ben-ryder/athena-testing";
import {DatabaseService} from "../../services/database/database.service";


@Controller( {
    path: '/v1/testing',
    identifier: "testing-controller",
    middleware: [TestingEnabledMiddleware]
})
export class TestingController {
    constructor(
        private databaseService: DatabaseService
    ) {}

    @Route({
        path: "/reset",
        httpMethod: HTTPMethods.POST,
        authRequired: false
    })
    async resetTestData(req: Request, res: Response, next: NextFunction) {
        const sql = await this.databaseService.getSQL();

        try {
            await resetTestData(sql);
            return res.status(HTTPStatusCodes.OK).send();
        }
        catch (e) {
            return next(e);
        }
    }
}

import { Injectable } from "@kangojs/core";

import {
    ChangeDto
} from "@ben-ryder/athena-js-lib";

import {ChangesDatabaseService} from "./database/changes.database.service";


@Injectable()
export class ChangesService {
    constructor(
       private changesDatabaseService: ChangesDatabaseService
    ) {}

    async add(owner: string, changes: ChangeDto[]) {
        return this.changesDatabaseService.add(owner, changes);
    }

    async list(owner: string, ids: string[]) {
        return this.changesDatabaseService.list(owner, ids);
    }

    async listIds(owner: string) {
        return this.changesDatabaseService.listIds(owner);
    }
}

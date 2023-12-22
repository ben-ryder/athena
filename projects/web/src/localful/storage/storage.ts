import {ApplicationDatabase} from "./application-database";
import {SecretsStorage} from "./secrets-storage";
import {GeneralStorage} from "./general-storage";

export class DeviceStorage {
    readonly app: ApplicationDatabase
    readonly general: GeneralStorage
    readonly secrets: SecretsStorage

    constructor() {
        this.general = new GeneralStorage()
        this.app = new ApplicationDatabase()
        this.secrets = new SecretsStorage()
    }
}

import {VaultDto} from "../dtos/vault.dto";
import {MetaPaginationData} from "../../common/meta-pagination-data";

export interface GetVaultsResponse {
  vaults: VaultDto[],
  meta: MetaPaginationData;
}

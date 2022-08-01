import React, {useEffect, useState} from 'react';

import {LinkButton} from "@ben-ryder/jigsaw";
import {getAppLink, routes} from "../../routes";
import {Page} from "../../patterns/pages/page";
import {AthenaErrorIdentifiers, VaultDto} from "@ben-ryder/athena-js-lib";
import {ContentLoadingIndicator} from "../../patterns/components/content-loading-indicator";
import {useAthena} from "../../helpers/use-athena";
import {Link} from "../../patterns/element/link";
import {GeneralQueryStatus} from "../../types/general-query-status";


export function ListVaultsPage() {
  const {apiClient, setCurrentUser} = useAthena();
  const [status, setStatus] = useState<GeneralQueryStatus>(GeneralQueryStatus.LOADING);
  const [vaults, setVaults] = useState<VaultDto[]>([]);

  useEffect(() => {
    async function loadVaults() {
      try {
        const data = await apiClient.getVaults();
        setVaults(data.vaults);
        setStatus(GeneralQueryStatus.SUCCESS);
      }
      catch (e: any) {
        if (e.response?.identifier === AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID) {
          setCurrentUser(null);
        }

        console.log(e);
        setStatus(GeneralQueryStatus.FAILED);
      }
    }
    loadVaults();
  }, []);

  return (
    <Page>
      <div className="w-full max-w-3xl mx-auto px-4 pt-12">
        <div className="py-2 flex justify-between items-end border-b border-br-blueGrey-600">
          <h1 className="font-bold text-br-whiteGrey-100 text-2xl">All Vaults</h1>
          <LinkButton href={routes.vaults.create}>New Vault</LinkButton>
        </div>
        {status !== GeneralQueryStatus.SUCCESS &&
            <div className="mt-8 flex justify-center items-center">
                <ContentLoadingIndicator
                    status={status}
                    loadingMessage="Loading vaults please wait..."
                    errorMessage="Failed to load vaults, please try again later."
                    emptyMessage="No vaults found."
                />
            </div>
        }
        {vaults.length > 0 &&
          <ul>
            {vaults.map(vault =>
              <li key={vault.id}>
                <Link href={getAppLink(vault.id)}>{vault.name}</Link>
                <Link href={routes.vaults.edit.replace(":vaultId", vault.id)}>edit vault</Link>
                <p>{vault.description}</p>
              </li>
            )}
          </ul>
        }
      </div>
    </Page>
  );
}


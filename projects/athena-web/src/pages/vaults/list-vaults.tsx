import React, {useEffect, useState} from 'react';

import {LinkButton} from "@ben-ryder/jigsaw";
import {routes} from "../../routes";
import {Page} from "../../patterns/pages/page";
import {AthenaErrorIdentifiers, VaultDto} from "@ben-ryder/athena-js-lib";
import {ContentLoadingIndicator} from "../../patterns/components/content-loading-indicator";
import {useAthena} from "../../helpers/use-athena";
import {GeneralQueryStatus} from "../../types/general-query-status";
import {Helmet} from "react-helmet-async";
import {VaultCard} from "../../patterns/components/vault-card";


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
      <Helmet>
        <title>Vaults | Athena</title>
      </Helmet>
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
              <VaultCard key={vault.id} vault={vault} />
            )}
          </ul>
        }
      </div>
    </Page>
  );
}


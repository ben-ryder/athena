import React, {useEffect, useState} from 'react';

import {useNavigate, useParams} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {Button} from "@ben-ryder/jigsaw";
import {AthenaErrorIdentifiers, VaultDto} from "@ben-ryder/athena-js-lib";
import {routes} from "../../routes";
import {ContentPage} from "../../patterns/pages/content-page";
import {ArrowLink} from "@ben-ryder/jigsaw/dist/patterns/03-elements/arrow-link/arrow-link";
import {GeneralQueryStatus} from "../../types/general-query-status";
import {LoadingPage} from "../../patterns/pages/loading-page";
import {Helmet} from "react-helmet-async";


export function DeleteVaultPage() {
  const navigate = useNavigate();
  const {apiClient, setCurrentUser} = useAthena();

  const [status, setStatus] = useState<GeneralQueryStatus>(GeneralQueryStatus.LOADING);
  const [pageErrorMessage, setPageErrorMessage] = useState<string|null>(null);

  const [vault, setVault] = useState<VaultDto|null>(null);
  const [vaultDeleteErrorMessage, setVaultDeleteErrorMessage] = useState<string|null>(null);

  const { vaultId } = useParams();

  useEffect(() => {
    async function getVault() {
      if (!vaultId) {
        setStatus(GeneralQueryStatus.FAILED);
        setPageErrorMessage("You have attempted to visit an invalid vault page");
        return;
      }

      try {
        const vault = await apiClient.getVault(vaultId);
        setStatus(GeneralQueryStatus.SUCCESS);
        setVault(vault);
      }
      catch (e: any) {
        setStatus(GeneralQueryStatus.FAILED);

        if (e.response?.statusCode === 404) {
          setPageErrorMessage("The vault you requested does not exist.")
        }
        else if (e.response?.statusCode === 400) {
          setPageErrorMessage("You appear to be requesting a vault with an invalid ID.")
        }
        else {
          setPageErrorMessage("An unexpected error occurred while fetching the vault, try again later.");
        }
      }
    }
    getVault();
  }, [vaultId]);

  const deleteVault = async function() {
    if (!vault) {
      setVaultDeleteErrorMessage("There was an unexpected error deleting the vault, try again later");
      return;
    }

    try {
      await apiClient.deleteVault(vault.id);
    }
    catch (e: any) {
      if (e.response?.identifier === AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID) {
        setCurrentUser(null);
      }

      console.log(e);
      setVaultDeleteErrorMessage("There was an unexpected error deleting the vault, try again later");
      return;
    }

    await navigate(routes.vaults.list);
  }

  if (!vault) {
    return (
      <>
        <Helmet>
          <title>Loading vault... | Athena</title>
        </Helmet>
        <LoadingPage
          status={status}
          loadingMessage="Loading vault..."
          errorMessage={pageErrorMessage || "An unexpected error occurred"}
          emptyMessage="An unexpected error occurred"
        />
      </>
    )
  }

  return (
    <ContentPage>
      <Helmet>
        <title>{`${vault.name} - delete | Athena`}</title>
      </Helmet>
      <ArrowLink direction="left" href={routes.vaults.list}>all vaults</ArrowLink>
      <div className="mt-8">
        <h1 className="font-bold text-4xl text-br-whiteGrey-100">Delete <span className="text-br-teal-600">{vault.name}</span></h1>
      </div>
      <div className="mt-8">
        <p className="text-br-whiteGrey-100">Are you sure you want to delete this vault? This will permanently delete all vault content including all notes, tags and queries.</p>

        {vaultDeleteErrorMessage &&
            <p className="text-br-red-500 my-2">{vaultDeleteErrorMessage}?</p>
        }

        <div className="flex justify-end mt-8">
          <Button styling="destructive" onClick={deleteVault}>Permanently Delete</Button>
        </div>
      </div>
    </ContentPage>
  )
}

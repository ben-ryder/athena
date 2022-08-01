import React, {useEffect, useState} from 'react';

import {useNavigate, useParams} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod/dist/zod";
import {Button, Input, TextArea} from "@ben-ryder/jigsaw";
import {AthenaErrorIdentifiers, CreateVaultRequest, CreateVaultRequestSchema, VaultDto} from "@ben-ryder/athena-js-lib";
import {routes} from "../../routes";
import {ContentPage} from "../../patterns/pages/content-page";
import {ArrowLink} from "@ben-ryder/jigsaw/dist/patterns/03-elements/arrow-link/arrow-link";
import {GeneralQueryStatus} from "../../types/general-query-status";
import {LoadingPage} from "../../patterns/pages/loading-page";


export function EditVaultPage() {
  const navigate = useNavigate();
  const {apiClient, setCurrentUser} = useAthena();

  const [vault, setVault] = useState<VaultDto|null>(null);

  const [status, setStatus] = useState<GeneralQueryStatus>(GeneralQueryStatus.LOADING);
  const [pageErrorMessage, setPageErrorMessage] = useState<string|null>(null);

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

  const [formErrorMessage, setFormErrorMessage] = useState<string|null>(null);
  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<CreateVaultRequest>({
    resolver: zodResolver(CreateVaultRequestSchema)
  });

  // todo: better typing not using create request
  const onSubmit: SubmitHandler<CreateVaultRequest> = async function(values: CreateVaultRequest) {
    if (!vault) {
      setFormErrorMessage("An unexpected error occurred while attempting to add the vault. Please try again later.");
      return;
    }

    try {
      await apiClient.updateVault(vault.id, {
        name: values.name,
        description: values.description
      });

      await navigate(routes.vaults.list);
    }
    catch (e: any) {
      console.log(e);

      if (e.response?.identifier === AthenaErrorIdentifiers.VAULT_NAME_EXISTS) {
        setError("name", {type: "custom", message: "You already have a vault with that name."})
      }
      else if (e.response?.identifier === AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID) {
        setCurrentUser(null);
      }
      else {
        setFormErrorMessage("An unexpected error occurred while attempting to add the vault. Please try again later.")
      }
    }
  };

  if (!vault) {
    return (
      <LoadingPage
        status={status}
        loadingMessage="Loading vault..."
        errorMessage={pageErrorMessage || "An unexpected error occurred"}
        emptyMessage="An unexpected error occurred"
      />
    )
  }

  return (
    <ContentPage>
      <ArrowLink direction="left" href={routes.vaults.list}>all vaults</ArrowLink>
      <div className="mt-8">
        <h1 className="font-bold text-4xl text-br-whiteGrey-100">Edit <span className="text-br-teal-600">{vault.name}</span></h1>
      </div>
      <div className="mt-8">
        <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <div className="mt-4">
            <Controller
              name="name"
              defaultValue={vault.name}
              control={control}
              render={({ field }) =>
                <Input {...field} id="name" label="Name" type="text" error={errors.name?.message} />
              }
            />
          </div>
          <div className="mt-4">
            <Controller
              name="description"
              defaultValue={vault.description}
              control={control}
              render={({ field }) =>
                <TextArea {...field} rows={3} id="description" label="Description" error={errors.description?.message} />
              }
            />
          </div>
          {formErrorMessage &&
              <div className="mt-4">
                  <p className="text-br-red-500">{formErrorMessage}</p>
              </div>
          }
          <div className="mt-6 flex justify-end">
            <Button type="submit" status={isSubmitting ? "awaiting" : "normal"}>Save</Button>
          </div>
        </form>
      </div>
    </ContentPage>
  )
}

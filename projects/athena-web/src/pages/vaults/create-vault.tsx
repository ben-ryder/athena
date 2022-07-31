import React, {useState} from 'react';

import {useNavigate} from "react-router-dom";
import {useAthena} from "../../helpers/use-athena";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod/dist/zod";
import {FormPage} from "../../patterns/pages/form-page";
import {Button, Input, TextArea} from "@ben-ryder/jigsaw";
import {AthenaErrorIdentifiers, CreateVaultRequest, CreateVaultRequestSchema} from "@ben-ryder/athena-js-lib";
import {routes} from "../../routes";


export function CreateVaultPage() {
  const navigate = useNavigate();
  const {apiClient} = useAthena();
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<CreateVaultRequest>({
    resolver: zodResolver(CreateVaultRequestSchema)
  });


  const onSubmit: SubmitHandler<CreateVaultRequest> = async function(values: CreateVaultRequest) {
    try {
      await apiClient.createVault({
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
      else {
        setErrorMessage("An unexpected error occurred while attempting to add the vault. Please try again later.")
      }
    }
  };

  return (
    <FormPage
      title="Create Vault"
      description={<p className="text-br-whiteGrey-200 mt-2">Create a new vault</p>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
        <div className="mt-4">
          <Controller
            name="name"
            defaultValue=""
            control={control}
            render={({ field }) =>
              <Input {...field} id="name" label="Name" type="text" error={errors.name?.message} />
            }
          />
        </div>
        <div className="mt-4">
          <Controller
            name="description"
            defaultValue=""
            control={control}
            render={({ field }) =>
              <TextArea {...field} rows={3} id="description" label="Description" error={errors.description?.message} />
            }
          />
        </div>
        {errorMessage &&
            <div className="mt-4">
                <p className="text-br-red-500">{errorMessage}</p>
            </div>
        }
        <div className="mt-6 flex justify-end">
          <Button type="submit" status={isSubmitting ? "awaiting" : "normal"}>Create</Button>
        </div>
      </form>
    </FormPage>
  )
}

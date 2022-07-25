import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import {Input, Button} from "@ben-ryder/jigsaw";

import { AthenaErrorIdentifiers } from "@ben-ryder/athena-js-lib";
import {useAthena} from "../../helpers/use-athena";

import {FormPage} from "../../patterns/layout/form-page";


interface RegisterFormData {
  username: string;
  password: string;
}


export function LoginPage() {
  const { apiClient } = useAthena();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>();


  const onSubmit: SubmitHandler<LoginFormData> = async function(values: LoginFormData) {
    try {
      await apiClient.login(values.username, values.password);

      // On successful login, redirect user to main homepage
      await navigate('/');
    }
    catch (e: any) {
      if (e.response?.identifier === AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID) {
        setErrorMessage("The supplied username & password combination is incorrect.")
      }
      else {
        setErrorMessage("An unexpected error occurred while attempting to log you in. Please try again later.")
      }
    }
  };

  return (
    <FormPage
      title="Log In"
      description={<p className="text-br-whiteGrey-200">Log in to your account. Don't have an account? <a href='/user/sign-up'>Sign Up</a></p>}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <Controller
            name="username"
            defaultValue=""
            control={control}
            render={({ field }) =>
              <Input {...field} id="username" label="Username" type="text" error={errors.username?.message} />
          }
          />
        </div>
        <div className="mt-4">
          <Controller
            name="password"
            defaultValue=""
            control={control}
            render={({ field }) =>
              <Input {...field} id="password" label="Password" type="password" error={errors.password?.message} />
          }
          />
        </div>
        {errorMessage &&
          <div className="mt-4">
              <p className="text-br-red-500">{errorMessage}</p>
          </div>
        }
        <div className="mt-4 flex justify-end">
          <Button type="submit">Log In</Button>
        </div>
      </form>
    </FormPage>
  );
}


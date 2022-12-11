import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input, Button, Link} from "@ben-ryder/jigsaw";
import {ErrorIdentifiers, LoginRequest} from "@ben-ryder/lfb-common";
import {Helmet} from "react-helmet-async";
import {routes} from "../../../routes";
import {FormPage} from "../../../patterns/pages/form-page";
import {InternalLink} from "../../../helpers/internal-link";
import {useLFBApplication} from "../../../helpers/lfb-context";


export function LoginPage() {
  const { lfbClient, setCurrentUser } = useLFBApplication();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequest)
  });


  const onSubmit: SubmitHandler<LoginRequest> = async function(values: LoginRequest) {
    try {
      const data = await lfbClient.login(values.username, values.password);

      setCurrentUser(data.user);
      await navigate(routes.home);
    }
    catch (e: any) {
      console.log(e);

      if (e.response?.identifier === ErrorIdentifiers.AUTH_CREDENTIALS_INVALID) {
        setErrorMessage("The supplied username & password combination is incorrect.");
      }
      else {
        setErrorMessage("An unexpected error occurred while attempting to log you in. Please try again later.");
      }
    }
  };

  return (
    <FormPage
      title="Log In"
      description={
        <div className="text-br-whiteGrey-200 mt-2">
          <p className="">Log in to your account below.</p>
          <p>Any content created on this device while not logged in will be deleted.</p>
        </div>
      }
      >
      <Helmet>
        <title>Log In | Athena</title>
      </Helmet>
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
        <div className="mt-6 flex justify-end">
          <Button type="submit" status={isSubmitting ? "awaiting" : "normal"}>Log In</Button>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <Link as={InternalLink} href={routes.users.register}>Register</Link>
          <Link as={InternalLink} href={routes.users.password.forgotten}>Forgotten your password?</Link>
        </div>
      </form>
    </FormPage>
  );
}


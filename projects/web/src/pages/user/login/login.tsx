import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input, Button} from "@ben-ryder/jigsaw";
import {ErrorIdentifiers, LoginRequest} from "@ben-ryder/lfb-common";
import {Helmet} from "react-helmet-async";
import {useApplication} from "../../../helpers/application-context";
import {routes} from "../../../routes";
import {FormPage} from "../../../patterns/pages/form-page";
import {Link} from "../../../patterns/element/link";


export function LoginPage() {
  const { application } = useApplication();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequest)
  });


  const onSubmit: SubmitHandler<LoginRequest> = async function(values: LoginRequest) {
    try {
      await application.login(values.username, values.password);
      await navigate(routes.app.main);
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
      description={<p className="text-br-whiteGrey-200 mt-2">Log in to your account. Don't have an account? <Link href={routes.users.register}>Register</Link></p>}
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
        <div className="mt-6 flex justify-center items-center">
          <p><Link href={routes.users.password.forgotten}>Forgotten your password?</Link></p>
        </div>
      </form>
    </FormPage>
  );
}


import React, {useState} from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input, Button} from "@ben-ryder/jigsaw";
import {AthenaErrorIdentifiers, CreateUserRequest} from "@ben-ryder/athena-js-lib";
import {z} from "zod";
import {routes} from "../../../routes";
import {FormPage} from "../../../patterns/pages/form-page";
import {Link} from "../../../patterns/element/link";
import {useAthena} from "../../../helpers/use-athena";
import {useNavigate} from "react-router-dom";

const UserRegister = z.object({
  username: CreateUserRequest.shape.username,
  email: CreateUserRequest.shape.email,
  password: CreateUserRequest.shape.password,
  passwordConfirmation: CreateUserRequest.shape.password
})
  .refine(
    (data) => {return data.password === data.passwordConfirmation},
    {message: "Password confirmation doesn't match password", path: ["passwordConfirmation"]}
  )

type UserRegister = z.infer<typeof UserRegister>;


export function RegisterEnabledPage() {
  const navigate = useNavigate();
  const {apiClient, setCurrentUser, storage} = useAthena();
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<UserRegister>({
    resolver: zodResolver(UserRegister)
  });


  const onSubmit: SubmitHandler<UserRegister> = async function(values: UserRegister) {
    try {
      const data = await apiClient.register({
        username: values.username,
        email: values.email,
        password: values.password
      });

      setCurrentUser(data.user);
      await navigate(routes.vaults.list);
    }
    catch (e: any) {
      if (e.response?.identifier === AthenaErrorIdentifiers.USER_EMAIL_EXISTS) {
        setError("email", {type: "custom", message: "That email address is already registered with an account"})
      }
      else if (e.response?.identifier === AthenaErrorIdentifiers.USER_USERNAME_EXISTS) {
        setError("username", {type: "custom", message: "That username is already registered with an account"})
      }
      else {
        setErrorMessage("An unexpected error occurred while attempting to log you in. Please try again later.")
      }
    }
  };

  return (
    <FormPage
      title="Register"
      description={
        <p className="text-br-whiteGrey-200 mt-2">Register for an account. Already have an account? <Link href={routes.users.login}>Log In</Link></p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
        <div className="mt-4">
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
              name="email"
              defaultValue=""
              control={control}
              render={({ field }) =>
                <Input {...field} id="email" label="Email" type="email" error={errors.email?.message} />
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
          <div className="mt-4">
            <Controller
              name="passwordConfirmation"
              defaultValue=""
              control={control}
              render={({ field }) =>
                <Input {...field} id="passwordConfirmation" label="Confirm Password" type="password" error={errors.passwordConfirmation?.message} />
              }
            />
          </div>
        </div>
        {errorMessage &&
            <div className="mt-4">
                <p className="text-br-red-500">{errorMessage}</p>
            </div>
        }
        <div className="mt-6 flex justify-end">
          <Button type="submit" status={isSubmitting ? "awaiting" : "normal"}>Register</Button>
        </div>
      </form>
    </FormPage>
  );
}


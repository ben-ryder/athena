import React, {useState} from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input, Button} from "@ben-ryder/jigsaw";
import {AthenaErrorIdentifiers, CreateUserRequestSchema} from "@ben-ryder/athena-js-lib";
import {FormPage} from "../../patterns/layout/form-page";
import {z} from "zod";
import {Link} from "../../patterns/element/link";
import {routes} from "../../routes";

const UserRegisterSchema = z.object({
  username: CreateUserRequestSchema.shape.username,
  email: CreateUserRequestSchema.shape.email,
  password: CreateUserRequestSchema.shape.password,
  passwordConfirmation: CreateUserRequestSchema.shape.password
})
  .refine(
    (data) => {return data.password === data.passwordConfirmation},
    {message: "Password confirmation doesn't match password", path: ["passwordConfirmation"]}
  )

type UserRegisterSchema = z.infer<typeof UserRegisterSchema>;

export function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<UserRegisterSchema>({
    resolver: zodResolver(UserRegisterSchema)
  });


  const onSubmit: SubmitHandler<UserRegisterSchema> = async function(values: UserRegisterSchema) {
    try {
      console.log(values);
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


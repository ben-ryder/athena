import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input, Button, P, H1} from "@ben-ryder/jigsaw";
import {
  UpdateUserRequestSchema
} from "@ben-ryder/athena-js-lib";
import {z} from "zod";
import {FormPage} from "../../../patterns/pages/form-page";
import {LoadingPage} from "../../../patterns/pages/loading-page";
import {Link} from "../../../patterns/element/link";
import {routes} from "../../../routes";
import {MessagePage} from "../../../patterns/pages/message-page";

// todo: replace with API schema once written
const ResetPasswordSchema = z.object({
  password: UpdateUserRequestSchema.shape.password,
  passwordConfirmation: UpdateUserRequestSchema.shape.password,
})
  .refine(
    (data) => {return data.password === data.passwordConfirmation},
    {message: "Password confirmation doesn't match password", path: ["passwordConfirmation"]}
  )
type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;

export enum ResetTokenStatus {
  CHECK_IN_PROGRESS = "CHECK_IN_PROGRESS",
  VALID = "VALID",
  INVALID = "INVALID",
  MISSING = "MISSING"
}

export function ResetPasswordPage() {
  const [searchParams, setSearchParams]  = useSearchParams();

  const [status, setStatus] = useState<ResetTokenStatus>(ResetTokenStatus.CHECK_IN_PROGRESS);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema)
  });

  const onSubmit: SubmitHandler<ResetPasswordSchema> = async function(values: ResetPasswordSchema) {
    try {
      console.log(values);
    }
    catch (e: any) {
      setErrorMessage("An unexpected error occurred. Please try again later.")
    }
  };

  useEffect(() => {
    setTimeout(() => {
      // todo: refactor to actual check
      const token = searchParams.get("token");
      if (!token) {
        setStatus(ResetTokenStatus.MISSING);
      }
      else if (token.includes("a")) {
        setStatus(ResetTokenStatus.VALID)
      }
      else {
        setStatus(ResetTokenStatus.INVALID);
      }
    }, 1000)
  }, [searchParams])

  if (status === ResetTokenStatus.CHECK_IN_PROGRESS) {
    return (
      <LoadingPage text="Checking your password reset link..." />
    )
  }
  else if (status === ResetTokenStatus.INVALID || status === ResetTokenStatus.MISSING) {
    return (
      <MessagePage
        heading="Invalid Reset Link"
        text="Your password reset link has expired or is invalid. If you still want to reset your password you will have to request another password reset email."
        extraContent={
          <Link href={routes.users.password.forgotten}>Request new password reset email</Link>
        }
      />
    )
  }
  else {
    return (
      <FormPage
        title="Reset Password"
        description={<p className="text-br-whiteGrey-200 mt-2">Enter your new password below.</p>}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
          <div className="mt-4">
            <Controller
              name="password"
              defaultValue=""
              control={control}
              render={({field}) =>
                <Input {...field} id="password" label="New Password" type="password" error={errors.password?.message} />
              }
            />
          </div>
          <div className="mt-4">
            <Controller
              name="passwordConfirmation"
              defaultValue=""
              control={control}
              render={({field}) =>
                <Input {...field} id="passwordConfirmation" label="Confirm Password" type="password" error={errors.passwordConfirmation?.message} />
              }
            />
          </div>
          {errorMessage &&
              <div className="mt-4">
                  <p className="text-br-red-500">{errorMessage}</p>
              </div>
          }
          <div className="mt-6 flex justify-end">
            <Button type="submit" status={isSubmitting ? "awaiting" : "normal"}>Reset Password</Button>
          </div>
        </form>
      </FormPage>
    );
  }
}


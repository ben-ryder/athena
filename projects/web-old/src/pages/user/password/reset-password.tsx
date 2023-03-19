import React, {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, Input, Link} from "@ben-ryder/jigsaw";
import {UpdateUserRequest} from "@ben-ryder/lfb-common";
import {z} from "zod";
import {FormPage} from "../../../patterns/pages/form-page";
import {LoadingPage} from "../../../patterns/pages/loading-page";
import {routes} from "../../../routes";
import {MessagePage} from "../../../patterns/pages/message-page";
import {Helmet} from "react-helmet-async";
import {GeneralQueryStatus} from "../../../types/general-query-status";
import {InternalLink} from "../../../helpers/internal-link";

// todo: replace with API schema once written
const ResetPasswordSchema = z.object({
  password: UpdateUserRequest.shape.password,
  passwordConfirmation: UpdateUserRequest.shape.password,
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
      <>
        <Helmet>
          <title>Reset Password | Athena</title>
        </Helmet>
        <LoadingPage
          status={GeneralQueryStatus.LOADING}
          loadingMessage="Checking your password reset link..."
          errorMessage="An error occurred"
          emptyMessage="An error occurred"
        />
      </>
    )
  }
  else if (status === ResetTokenStatus.INVALID || status === ResetTokenStatus.MISSING) {
    return (
      <MessagePage
        heading="Invalid Reset Link"
        text="Your password reset link has expired or is invalid. If you still want to reset your password you will have to request another password reset email."
        extraContent={
          <Link as={InternalLink} href={routes.users.password.forgotten}>Request new password reset email</Link>
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
        <Helmet>
          <title>Reset Password | Athena</title>
        </Helmet>
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


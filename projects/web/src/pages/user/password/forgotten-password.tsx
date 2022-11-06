import React, {useState} from 'react';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input, Button} from "@ben-ryder/jigsaw";
import {z} from "zod";
import {FormPage} from "../../../patterns/pages/form-page";
import {Helmet} from "react-helmet-async";

// todo: replace with API schema once written
const ForgottenPasswordSchema = z.object({
  email: z.string().email("You must enter a valid email address")
})
type ForgottenPasswordSchema = z.infer<typeof ForgottenPasswordSchema>;


export function ForgottenPasswordPage() {
  const [errorMessage, setErrorMessage] = useState<string|null>(null);

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgottenPasswordSchema>({
    resolver: zodResolver(ForgottenPasswordSchema)
  });

  const onSubmit: SubmitHandler<ForgottenPasswordSchema> = async function(values: ForgottenPasswordSchema) {
    try {
      console.log(values);
    }
    catch (e: any) {
      setErrorMessage("An unexpected error occurred while requesting your password reset. Please try again later.")
    }
  };

  return (
    <FormPage
      title="Reset Password"
      description={<p className="text-br-whiteGrey-200 mt-2">Enter your account email address below to request a password reset email.</p>}
    >
      <Helmet>
        <title>Reset Password | Athena</title>
      </Helmet>
      <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
        <div className="mt-4">
          <Controller
            name="email"
            defaultValue=""
            control={control}
            render={({field}) =>
              <Input {...field} id="email" label="Email" type="email" error={errors.email?.message} />
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


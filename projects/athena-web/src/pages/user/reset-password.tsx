import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input, Button} from "@ben-ryder/jigsaw";
import {
  UpdateUserRequestSchema
} from "@ben-ryder/athena-js-lib";
import {useAthena} from "../../helpers/use-athena";
import {FormPage} from "../../patterns/layout/form-page";
import {z} from "zod";

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


export function ResetPasswordPage() {
  const { apiClient } = useAthena();
  const navigate = useNavigate();
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


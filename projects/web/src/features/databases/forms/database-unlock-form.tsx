import {useCallback} from "react";
import {
	JInput,
	JErrorText,
	JButtonGroup, JButton,
	JForm, JFormContent, JFormRow
} from "@ben-ryder/jigsaw-react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useLocalful} from "@localful-athena/react/use-localful";


const UnlockFormSchema = z.object({
	password: z.string().min(1, "Please enter your password ")
})
type UnlockFormSchema = z.infer<typeof UnlockFormSchema>

export interface DatabaseUnlockFormProps {
	databaseId: string
	onSuccess: () => void;
}

export function DatabaseUnlockForm(props: DatabaseUnlockFormProps) {
	const {
		handleSubmit,
		control,
		formState: {errors},
		setError
	} = useForm<UnlockFormSchema>({
		resolver: zodResolver(UnlockFormSchema),
		defaultValues: {
			password: '',
		}
	})

	const { openDatabase, unlockDatabase } = useLocalful()

	const onSubmit = useCallback(async (data: UnlockFormSchema) => {
		const unlocked = await unlockDatabase(props.databaseId, data.password)
		if (!unlocked) {
			return setError('password', { message: 'Your entered password is incorrect.' })
		}

		// todo: could unlock and open be the same operations. there is a disconnect at the moment?
		await openDatabase(props.databaseId)
		props.onSuccess()
	}, [unlockDatabase])

	return (
		<JForm className="database-form" onSubmit={handleSubmit(onSubmit)} noValidate>
			<JFormContent>
				<JFormRow>
					<Controller
						name='password'
						control={control}
						render={({field: {...rest}}) => (
							<JInput
								label="Password"
								id="password"
								type="password"
								placeholder="your unlock password..."
								error={errors.password?.message}
								required={true}
								{...rest}
							/>
						)}
					/>
				</JFormRow>
			</JFormContent>
			<div className="database-form__header">
				{errors.root?.message && (
					<JErrorText>{errors.root.message}</JErrorText>
				)}
			</div>
			<JFormRow>
				<JButtonGroup>
					<JButton type="submit">{'Unlock and Open'}</JButton>
				</JButtonGroup>
			</JFormRow>
		</JForm>
	);
}

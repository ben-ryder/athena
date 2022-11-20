import {Button, Input, MultiSelect} from "@ben-ryder/jigsaw";
import {routes} from "../../routes";
import {ArrowLink} from "../../patterns/element/arrow-link";
import {z} from "zod";
import {SubmitHandler, useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export const TaskFormData = z.object({
  name: z.string().min(1, "Must be at least 1 character long"),
  tags: z.array(z.string())
})
export type TaskFormData = z.infer<typeof TaskFormData>;

export interface TaskListFormProps {
  values: TaskFormData,
  onSave: (values: TaskFormData) => void,
  onDelete?: () => void
}


export function TaskListForm(props: TaskListFormProps) {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    resolver: zodResolver(TaskFormData)
  });

  const onSubmit: SubmitHandler<TaskFormData> = async function(values: TaskFormData) {
    props.onSave(values)
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 px-4">
      <div className="flex justify-between items-center">
        <ArrowLink direction="left" link={routes.content.tasks.list}>Task Lists</ArrowLink>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mt-4">
          <Controller
            name="name"
            defaultValue={props.values.name}
            control={control}
            render={({ field }) =>
              <Input {...field} id="name" label="Name" type="text" error={errors.name?.message} />
            }
          />
        </div>
        <div className="mt-4">
          <Controller
            name="tags"
            defaultValue={props.values.tags}
            control={control}
            render={({field}) =>
              <MultiSelect
                id="tags"
                label="Tags"
                placeholder="select tags..."
                options={[]}
                currentOptions={field.value}
                name={field.name}
                ref={field.ref}
                onOptionsChange={(options) => {field.onChange(options)}}
              />
            }
          />
        </div>
        <div className="flex justify-end items-center mt-6">
          {props.onDelete &&
              <Button
                  type="button"
                  className="mr-2"
                  styling="destructive"
                  onClick={() => {
                    if (props.onDelete) {
                      props.onDelete();
                    }
                  }}
              >Delete</Button>
          }
          <Button type="submit" styling="primary" status={isSubmitting ? "awaiting" : "normal"}>Save</Button>
        </div>
      </form>
    </div>
  )
}

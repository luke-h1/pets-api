/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentProps } from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import z from 'zod';

export function useForm<T extends z.Schema<any, any>>({
  schema,
  ...props
}: Exclude<UseFormProps<z.infer<T>>, 'resolver'> & { schema?: T }) {
  return useForm({
    ...props,
    resolver: schema ? zodResolver(schema) : undefined,
  });
}

interface FormOptions<T extends FieldValues>
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormOptions<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <fieldset disabled={form.formState.isSubmitting}>{children}</fieldset>
      </form>
    </FormProvider>
  );
}

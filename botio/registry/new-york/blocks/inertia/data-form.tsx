import { HTMLAttributes, useCallback, useId, useMemo } from "react"
import {
  DataFormContainerProvider,
  DataFormProvider,
  useDataFormContainerContext,
  useDataFormContext,
  DataFormContainerAction,
  FormDataType,
  DataFormFieldProvider,
  useDataFormFieldContext,
  DataFormAction
} from "./data-form-context"
import { InertiaFormProps, useForm } from "@inertiajs/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Slot } from "@radix-ui/react-slot"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import LoadingScreen from "@/components/botio/shared/loading-screen"
import { Input } from "@/components/ui/input"
import { FormDataErrors } from "@inertiajs/core"

interface DataFormContainerProps {
  children?: React.ReactNode
  action?: DataFormContainerAction
  className?: string
}

function DataFormContainer({ children, action = DataFormAction.Read, className, ...props }: DataFormContainerProps) {
  return (
    <DataFormContainerProvider action={action}>
      <div className={cn('w-full max-w-4xl mx-auto p-6', className)} {...props}>{children}</div>
    </DataFormContainerProvider>
  )
}

interface UseDataFormReturn<T extends FormDataType<object>> {
  form: InertiaFormProps<T>
  reading: boolean
  creating: boolean
  updating: boolean
}

function useDataForm<T extends FormDataType<T>>(initialValues: T): UseDataFormReturn<T> {
  const form = useForm<T>(initialValues)
  const { action } = useDataFormContainerContext()
  const reading = useMemo(() => action === "read", [action])
  const creating = useMemo(() => action === "create", [action])
  const updating = useMemo(() => action === "update", [action])

  return { form, reading, creating, updating }
}

interface DataFormProps {
  children?: React.ReactNode
  form: InertiaFormProps<object>
  onFormSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
}

function DataForm({ children, form, onFormSubmit }: DataFormProps) {
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onFormSubmit(e)
  }, [onFormSubmit])

  return (
    <DataFormProvider form={form}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {children}
      </form>
    </DataFormProvider>
  )
}

interface DataFormCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode
  title?: string
  description?: string
}

function DataFormCard({ children, className, title, description, ...props }: DataFormCardProps) {
  return (
    <Card data-slot="data-form-card" className={cn("grid grid-cols-1", className)} {...props}>
      {title && <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>}
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}

interface DataFormGroupProps {
  children: React.ReactNode;
  className?: string;
}

function DataFormGroup({ children, className, ...props }: DataFormGroupProps) {
  return <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)} {...props}>{children}</div>;
}

interface DataFormFieldProps {
  name?: string
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

function DataFormField({ name, children, className, fullWidth = false, ...props }: DataFormFieldProps) {
  const id = useId()
  return (
    <DataFormFieldProvider name={name ?? id}>
      <div data-slot="data-form-field" className={cn("grid grid-cols-1 gap-2 place-content-start", fullWidth && "col-span-full", className)} {...props}>
        {children}
      </div>
    </DataFormFieldProvider>
  )
}

function DataFormLabel({ children, required = false }: { children: React.ReactNode, required?: boolean }) {
  const { action } = useDataFormContainerContext()
  const { name } = useDataFormFieldContext()
  return (
    <Label data-slot="data-form-label" htmlFor={name} className="font-bold gap-0 min-h-4 flex items-start">
      {children}
      {action !== DataFormAction.Read && (required ? <span>*</span> : <span className="ms-1 text-slate-400 text-xs font-normal">(Opcional)</span>)}
    </Label>
  )
}

interface DataFormControlProps extends React.ComponentProps<typeof Slot> {
  disabled?: boolean
  autoComplete?: string
  readingValue?: unknown,
  field?: React.ReactElement,
  onChange?: (value: unknown, e?: React.ChangeEvent<HTMLInputElement>) => void
}

function DataFormControl<C extends React.ElementType>({ readingValue, field, ...props }: DataFormControlProps & React.ComponentProps<C> & { field?: React.ReactElement }) {
  const { action } = useDataFormContainerContext()
  const { name } = useDataFormFieldContext()

  if (action === "read" && readingValue) {
    return (
        <Input
            data-slot="data-form-control"
            data-action={action}
            defaultValue={readingValue as string}
            disabled
            className={cn(props.className, "data-[action=read]:opacity-100")}
        />
    )
  }

  return (
    <Slot
      data-slot="data-form-control"
      data-action={action}
      name={name}
      {...props}
      id={name}
      className={cn(props.className, "data-[action=read]:opacity-100")}
      disabled={action === "read" || props.disabled}
      autoComplete={props.autoComplete ?? "off"}
    >
      {field}
    </Slot>
  )
}

interface DataFormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string
}

function DataFormError({ message, className = "", ...props }: DataFormErrorProps) {
  const { form } = useDataFormContext()
  const { name } = useDataFormFieldContext()
  const error = useMemo(() => {
    return form.errors[name as keyof FormDataErrors<object>]
  }, [form.errors, name])

  return (
    <p {...props} className={cn("text-sm text-destructive", className)}>
      {message ?? error}
    </p>
  )
}

interface DataFormSubmitProps extends React.ComponentProps<typeof Button> {
  processing?: boolean
  showLoadingScreen?: boolean
}

function DataFormSubmit({ children, processing, showLoadingScreen = false, ...props }: DataFormSubmitProps) {
  const { action } = useDataFormContainerContext()
  const { form } = useDataFormContext()
  const buttonText = useMemo(() => action === "create" ? "Guardar" : "Actualizar", [action])

  if (action === "read") return null

  return (
    <>
      <div className="col-span-full">
        <Button data-slot="data-form-submit" type="submit" disabled={processing || form.processing} className={cn("col-span-full", props.className)} {...props}>
          {processing ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : null}
          {children ? children : buttonText}
        </Button>
      </div>
      {showLoadingScreen && <LoadingScreen loading={processing || form.processing} message="Procesando..." />}
    </>
  )
}

interface DataFormHelperProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string
}

function DataFormHelper({ children, message, className = "", ...props }: DataFormHelperProps) {
  return (
    <p {...props} className={cn("text-sm text-muted-foreground", className)}>
      {message ?? children}
    </p>
  )
}

interface DataFormSubGroupProps {
  children?: React.ReactNode;
  className?: string;
}

function DataFormSubGroup({ children, className, ...props }: DataFormSubGroupProps) {
  return <div className={cn("border border-border border-dashed rounded-md p-4 space-y-2", className)} {...props}>{children}</div>;
}

interface DataFormComponent<TValues extends object, T extends Record<string, unknown>> extends Omit<React.ComponentProps<typeof DataForm>, 'form' | 'onFormSubmit'> {
    data: T;
    onFormSubmit?: (form: InertiaFormProps<TValues>, e?: React.FormEvent<HTMLFormElement>) => void;
}

export {
  DataFormContainer,
  DataForm,
  DataFormCard,
  DataFormGroup,
  DataFormField,
  DataFormLabel,
  DataFormControl,
  DataFormError,
  DataFormSubmit,
  DataFormHelper,
  DataFormSubGroup,
  useDataForm,
  DataFormAction,
}

export type {
  FormDataType,
  DataFormComponent,
  UseDataFormReturn,
}

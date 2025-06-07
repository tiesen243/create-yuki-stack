import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '@yuki/ui'

interface FormError<TValue extends Record<string, unknown>> {
  message?: string
  issues?: Record<keyof TValue, string>
}

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | string
  | number
  | boolean

interface FormFieldContextValue<
  TValue extends Record<string, unknown>,
  TName extends keyof TValue = keyof TValue,
> {
  field: {
    name: TName
    value: TValue[TName]
    onChange: (event: ChangeEvent) => void
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => Promise<void> | void
  }
  state: {
    isPending: boolean
    hasError: boolean
    error?: string
  }
  meta: {
    id: string
    formItemId: string
    formDescriptionId: string
    formMessageId: string
  }
}

const FormFieldContext = React.createContext<FormFieldContextValue<
  Record<string, unknown>
> | null>(null)

function useFormField<
  TForm extends ReturnType<typeof useForm>,
  TName extends keyof TForm['state']['value'] = keyof TForm['state']['value'],
>() {
  const formField = React.use(
    FormFieldContext,
  ) as unknown as FormFieldContextValue<TForm['state']['value'], TName> | null
  if (!formField)
    throw new Error('useFormField must be used within a FormField')
  return formField
}

function useForm<
  TValue extends Record<string, unknown>,
  TSchema extends StandardSchemaV1 | ((value: TValue) => TValue),
  TData,
  TError extends FormError<TValue>,
>({
  defaultValues,
  validator,
  onSubmit,
  onSuccess,
  onError,
}: {
  defaultValues: TValue
  validator?: TSchema extends StandardSchemaV1
    ? Required<InferInput<TSchema>> extends TValue
      ? TSchema
      : Types<TValue>['input']
    : (value: TValue) => Result<TValue>
  onSubmit: (value: TValue) => Promise<TData> | TData
  onSuccess?: (data: TData) => void | Promise<void>
  onError?: (error: TError) => void | Promise<void>
}) {
  const formValueRef = React.useRef<TValue>(defaultValues)
  const formDataRef = React.useRef<TData | null>(null)
  const formErrorRef = React.useRef<TError>(null)

  const [isPending, startTransition] = React.useTransition()

  const validateField = React.useCallback(
    async <TKey extends keyof TValue>(
      fieldKey?: TKey,
      fieldValue?: TValue[TKey],
    ): Promise<
      | { isValid: true; data: TValue }
      | { isValid: false; errors: Record<keyof TValue, string> }
    > => {
      const valueToValidate = fieldKey
        ? { ...formValueRef.current, [fieldKey]: fieldValue }
        : formValueRef.current

      if (!validator) return { isValid: true, data: valueToValidate }

      let validationResult: Result<TValue> | null = null
      if (typeof validator === 'function') {
        validationResult = validator(valueToValidate)
      } else {
        validationResult = await (validator as StandardSchemaV1<TValue>)[
          '~standard'
        ].validate(valueToValidate)
      }

      if (validationResult.issues) {
        const errors = validationResult.issues.reduce(
          (errorMap, issue) => {
            errorMap[issue.path as unknown as keyof TValue] = issue.message
            return errorMap
          },
          {} as Record<keyof TValue, string>,
        )
        return { isValid: false, errors }
      }
      return { isValid: true, data: validationResult.value }
    },
    [validator],
  )

  const handleSubmit = React.useCallback(() => {
    startTransition(async () => {
      formDataRef.current = null
      formErrorRef.current = null

      const validationResult = await validateField()
      if (!validationResult.isValid) {
        formErrorRef.current = { issues: validationResult.errors } as TError
        return
      }

      try {
        const result = await onSubmit(validationResult.data)
        formDataRef.current = result
        await onSuccess?.(result)
      } catch (error) {
        formDataRef.current = null
        const message = error instanceof Error ? error.message : 'Unknown error'
        formErrorRef.current = { message } as TError
        await onError?.({ message } as TError)
      }
    })
  }, [onError, onSubmit, onSuccess, validateField])

  const Field = React.useCallback(
    function FormField<TFieldName extends keyof TValue>({
      name,
      render,
    }: {
      name: TFieldName
      render: (
        props: FormFieldContextValue<TValue, TFieldName>,
      ) => React.ReactNode
    }) {
      const [value, setValue] = React.useState(formValueRef.current[name])
      const prevValueRef = React.useRef(value)

      const [error, setError] = React.useState(
        formErrorRef.current?.issues?.[name] ?? '',
      )

      const parseValue = React.useCallback((target: HTMLInputElement) => {
        switch (target.type) {
          case 'number':
            return target.valueAsNumber as TValue[TFieldName]
          case 'checkbox':
            return target.checked as TValue[TFieldName]
          case 'date':
            return target.valueAsDate as TValue[TFieldName]
          default:
            return target.value as TValue[TFieldName]
        }
      }, [])

      const handleChange = React.useCallback(
        (event: ChangeEvent) => {
          const newValue =
            typeof event === 'object' && 'target' in event
              ? parseValue(event.target)
              : (event as TValue[TFieldName])

          setValue(newValue)

          React.startTransition(() => {
            formValueRef.current[name] = newValue
          })
        },
        [name, parseValue],
      )

      const handleBlur = React.useCallback(async () => {
        if (prevValueRef.current === value) return
        prevValueRef.current = value

        const results = await validateField(name, value)
        if (!results.isValid && results.errors[name])
          setError(results.errors[name])
        else setError('')
      }, [name, value])

      const id = React.useId()

      const formFieldContextValue = React.useMemo(
        () =>
          ({
            field: { name, value, onChange: handleChange, onBlur: handleBlur },
            state: { isPending, hasError: !!error, error },
            meta: {
              id,
              formItemId: `${id}-form-item`,
              formDescriptionId: `${id}-form-item-description`,
              formMessageId: `${id}-form-item-message`,
            },
          }) satisfies FormFieldContextValue<TValue, TFieldName>,
        [error, handleBlur, handleChange, id, name, value],
      )

      return (
        <FormFieldContext value={formFieldContextValue as never}>
          {render(formFieldContextValue)}
        </FormFieldContext>
      )
    },
    [isPending, validateField],
  )

  const Label = React.useCallback(function FormLabel({
    className,
    ...props
  }: React.ComponentProps<'label'>) {
    const { state, meta } = useFormField<never>()

    return (
      <label
        data-slot="form-label"
        htmlFor={meta.formItemId}
        aria-disabled={state.isPending}
        aria-invalid={state.hasError}
        className={cn(
          'text-sm leading-none font-medium',
          'aria-disabled:cursor-not-allowed aria-disabled:opacity-70',
          'aria-invalid:text-destructive',
          className,
        )}
        {...props}
      />
    )
  }, [])

  const Control = React.useCallback(function FormControl({
    className,
    ...props
  }: React.ComponentProps<'input'>) {
    const { state, meta } = useFormField()

    return (
      <Slot
        data-slot="form-control"
        id={meta.formItemId}
        aria-describedby={
          !state.hasError
            ? meta.formDescriptionId
            : `${meta.formDescriptionId} ${meta.formMessageId}`
        }
        aria-invalid={state.hasError}
        aria-disabled={state.isPending}
        className={cn(
          'aria-disabled:cursor-not-allowed aria-disabled:opacity-70',
          className,
        )}
        {...props}
      />
    )
  }, [])

  const Description = React.useCallback(function FormDescription({
    children,
    className,
    ...props
  }: React.ComponentProps<'span'>) {
    const { meta } = useFormField()

    return (
      <span
        data-slot="form-description"
        id={meta.formDescriptionId}
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
      >
        {children}
      </span>
    )
  }, [])

  const Message = React.useCallback(function FormMessage({
    children,
    className,
    ...props
  }: React.ComponentProps<'span'>) {
    const { state, meta } = useFormField()
    const body = state.hasError ? String(state.error) : children

    return (
      <span
        data-slot="form-message"
        id={meta.formMessageId}
        className={cn('text-destructive text-sm', className)}
        {...props}
      >
        {body}
      </span>
    )
  }, [])

  const reset = React.useCallback(() => {
    Object.assign(formValueRef.current, defaultValues)
    formErrorRef.current = null
    formDataRef.current = null
  }, [defaultValues])

  return React.useMemo(
    () => ({
      Field,
      Label,
      Control,
      Description,
      Message,
      handleSubmit,
      reset,

      state: {
        isPending,
        hasError: !!formErrorRef.current,
        value: formValueRef.current,
        data: formDataRef.current,
        error: formErrorRef.current,
      },
    }),
    [
      Control,
      Description,
      Field,
      Label,
      Message,
      handleSubmit,
      isPending,
      reset,
    ],
  )
}

export { useForm }

/** The Standard Schema interface. */
interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly '~standard': Props<Input, Output>
}

interface Props<Input = unknown, Output = Input> {
  /** The version number of the standard. */
  readonly version: 1
  /** The vendor name of the schema library. */
  readonly vendor: string
  /** Validates unknown input values. */
  readonly validate: (
    value: unknown,
  ) => Result<Output> | Promise<Result<Output>>
  /** Inferred types associated with the schema. */
  readonly types?: Types<Input, Output> | undefined
}

/** The result interface of the validate function. */
type Result<Output> = SuccessResult<Output> | FailureResult

/** The result interface if validation succeeds. */
interface SuccessResult<Output> {
  /** The typed output value. */
  readonly value: Output
  /** The non-existent issues. */
  readonly issues?: undefined
}

/** The result interface if validation fails. */
interface FailureResult {
  /** The issues of failed validation. */
  readonly issues: readonly Issue[]
}

/** The issue interface of the failure output. */
interface Issue {
  /** The error message of the issue. */
  readonly message: string
  /** The path of the issue, if any. */
  readonly path?: readonly (PropertyKey | PathSegment)[] | undefined
}

/** The path segment interface of the issue. */
interface PathSegment {
  /** The key representing a path segment. */
  readonly key: PropertyKey
}

/** The Standard Schema types interface. */
interface Types<Input = unknown, Output = Input> {
  /** The input type of the schema. */
  readonly input: Input
  /** The output type of the schema. */
  readonly output: Output
}

/** Infers the input type of a Standard Schema. */
type InferInput<Schema extends StandardSchemaV1> = NonNullable<
  Schema['~standard']['types']
>['input']

import { createContext, useContext } from "react"
import { FormDataType } from "@inertiajs/core"
import { InertiaFormProps } from "@inertiajs/react"

enum DataFormAction {
  Create = "create",
  Update = "update",
  Read = "read",
}

type DataFormContainerAction = DataFormAction

type DataFormContainerContextType = {
  action: DataFormContainerAction
}

type DataFormContextType = {
  form: InertiaFormProps<FormDataType<object>>
}

type DataFormFieldContextType = {
  name: string
}

interface DataFormContainerProviderProps {
  children: React.ReactNode
  action: DataFormContainerAction
}

interface DataFormProviderProps {
  children: React.ReactNode
  form: InertiaFormProps<FormDataType<object>>
}

interface DataFormFieldProviderProps {
  children: React.ReactNode
  name: string
}

const DataFormContainerContext = createContext<DataFormContainerContextType>({ action: DataFormAction.Read })
const DataFormContext = createContext<DataFormContextType | null>(null)
const DataFormFieldContext = createContext<DataFormFieldContextType>({ name: "" })

function useDataFormContainerContext(): DataFormContainerContextType {
  const context = useContext(DataFormContainerContext)
  if (!context) {
    throw new Error("useDataFormContext must be used within a DataFormContainerProvider")
  }
  return context
}

function useDataFormContext(): DataFormContextType {
  const context = useContext(DataFormContext)
  if (!context) {
    throw new Error("useDataFormContext must be used within a DataFormProvider")
  }
  return context
}

function useDataFormFieldContext(): DataFormFieldContextType {
  const context = useContext(DataFormFieldContext)
  if (!context) {
    throw new Error("useDataFormFieldContext must be used within a DataFormFieldProvider")
  }
  return context
}

function DataFormContainerProvider({ children, action = DataFormAction.Read }: DataFormContainerProviderProps) {
  return <DataFormContainerContext.Provider value={{ action }}>{children}</DataFormContainerContext.Provider>
}

function DataFormProvider({ children, form }: DataFormProviderProps) {
  return <DataFormContext.Provider value={{ form }}>{children}</DataFormContext.Provider>
}

function DataFormFieldProvider({ children, name }: DataFormFieldProviderProps) {
  return <DataFormFieldContext.Provider value={{ name }}>{children}</DataFormFieldContext.Provider>
}

export {
    DataFormContainerProvider,
    useDataFormContainerContext,
    DataFormProvider,
    useDataFormContext,
    DataFormFieldProvider,
    useDataFormFieldContext,
    DataFormAction,
}
export type { DataFormContainerAction, FormDataType }

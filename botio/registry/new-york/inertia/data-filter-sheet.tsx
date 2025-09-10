import React, { useMemo, useEffect, useState } from "react"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Filter, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { router } from "@inertiajs/react"
import { useLocation } from "react-use"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"

interface DataFilterFields {
    type: 'input' | 'select' | 'checkbox' | 'radio'
    name: string
    label: string
    placeholder?: string
    inputType?: 'text' | 'email' | 'number' | 'date' | 'search'
    options?: {
        value: string
        label: string
    }[]
    optionsUrl?: string | null
    optionsKey?: string
    optionsValue?: string
    defaultValue?: string | boolean
    required?: boolean
    only?: string[]
    prop?: string
}

interface DataFilterSheetProps {
    children?: React.ReactNode
    only: string[]
    fields: DataFilterFields[]
    onOpenChange?: (open: boolean) => void
    title?: string
    description?: string
    showActiveFilters?: boolean
    clearFiltersText?: string
    applyText?: string
    cancelText?: string
}

function DataFilterField({
    field,
    value,
    onChange
}: {
    field: DataFilterFields
    value?: string | boolean
    onChange: (name: string, value: string | boolean) => void
}) {
    const [data, setData] = useState<{ [key: string]: string }[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // const { data = [], error, isLoading } = useFetcher(field.optionsUrl as string | null)

    const options = useMemo(() => {
        if (field.options) {
            return field.options
        }
        return (data as { [key: string]: string }[]).map((item) => ({
            value: item[field.optionsKey || 'id'],
            label: item[field.optionsValue || 'name']
        }))
    }, [data, field.options, field.optionsKey, field.optionsValue])

    useEffect(() => {
        if (field.optionsUrl) {
            setIsLoading(true)
            const only = field?.only ? field.only : []
            const prop = field?.prop ? [field.prop] : []
            router.visit(field.optionsUrl as string, {
                method: 'get',
                preserveState: true,
                preserveScroll: true,
                preserveUrl: true,
                only: [...only, ...prop],
                onSuccess: (page) => {
                    if (field.prop) {
                        setData(page.props[field.prop] as { [key: string]: string }[])
                    }
                    setError(null)
                    setIsLoading(false)
                },
                onError: (error) => {
                    setError(error.message)
                    setIsLoading(false)
                }
            })
        }
    }, [field.optionsUrl, field.only, field.prop])

    if (field.optionsUrl && error) {
        return (
            <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <div className="text-sm text-red-500">Error al cargar opciones</div>
            </div>
        )
    }

    if (field.optionsUrl && isLoading) {
        return (
            <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Cargando...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {field.type === 'input' && (
                <Input
                    type={field.inputType || 'text'}
                    name={field.name}
                    id={field.name}
                    placeholder={field.placeholder}
                    value={value as string || ''}
                    onChange={(e) => {
                        onChange(field.name, e.target.value)
                    }}
                />
            )}

            {field.type === 'select' && (
                <Select
                    name={field.name}
                    value={value as string || ''}
                    onValueChange={(val: string) => {
                        onChange(field.name, val)
                    }}
                >
                    <SelectTrigger id={field.name}>
                        <SelectValue placeholder={field.placeholder || "Selecciona una opción"} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {field.type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={typeof value === 'boolean' ? value : false}
                        onCheckedChange={(checked) => onChange(field.name, checked as boolean)}
                    />
                    <Label htmlFor={field.name} className="text-sm font-normal">
                        {field.label}
                    </Label>
                </div>
            )}

            {field.type === 'radio' && (
                <RadioGroup
                    name={field.name}
                    value={value as string || ''}
                    onValueChange={(val: string) => onChange(field.name, val)}
                >
                    {options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                            <Label htmlFor={`${field.name}-${option.value}`} className="text-sm font-normal">
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )}
        </div>
    )
}

function DataFilterSheet({
    children,
    only,
    fields,
    onOpenChange,
    title = "Filtros",
    description = "Da click en el botón \"Aplicar\" para filtrar los datos",
    showActiveFilters = true,
    clearFiltersText = "Limpiar",
    applyText = "Aplicar",
    cancelText = "Cancelar"
}: DataFilterSheetProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isFiltering, setIsFiltering] = React.useState(false)
    const [formValues, setFormValues] = React.useState<Record<string, string | boolean>>({})
    const formId = React.useId()
    const formRef = React.useRef<HTMLFormElement>(null)
    const location = useLocation()
    const isMobile = useIsMobile()

    // Extraer valores iniciales de la URL
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search || '')
        const initialValues: Record<string, string | boolean> = {}

        fields.forEach(field => {
            const filterKey = `filter_${field.name}`
            const urlValue = urlParams.get(filterKey)

            if (urlValue !== null) {
                if (field.type === 'checkbox') {
                    initialValues[field.name] = urlValue === 'true' || urlValue === '1'
                } else {
                    initialValues[field.name] = urlValue
                }
            } else if (field.defaultValue !== undefined) {
                initialValues[field.name] = field.defaultValue
            } else {
                // Establecer valores vacíos para campos sin valor
                if (field.type === 'checkbox') {
                    initialValues[field.name] = false
                } else {
                    initialValues[field.name] = ''
                }
            }
        })

        setFormValues(initialValues)
    }, [location.search, fields])

    const handleFieldChange = (name: string, value: string | boolean) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsFiltering(true)

        const filters: Record<string, string> = {}
        const currentQuery = new URLSearchParams(location.search)
        const query = Object.fromEntries(currentQuery.entries())

        delete query.page
        delete query.per_page

        for (const [key, value] of Object.entries(formValues)) {
            if (value !== '' && value !== false && value !== null && value !== undefined) {
                filters[`filter_${key}`] = String(value)
            }
        }

        router.get(location.pathname || "/", { ...query, ...filters }, {
            only: only,
            preserveState: true,
            onFinish: () => {
                setIsFiltering(false)
                setIsOpen(false)
            },
        })
    }

    const handleClearFilters = () => {
        setFormValues({})
        const filters: Record<string, string> = {}

        router.get(location.pathname || "/", filters, {
            only: only,
            preserveState: true,
            onFinish: () => {
                setIsFiltering(false)
                handleOpenChange(false)
            },
        })
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        onOpenChange?.(open)
    }

    // Contar filtros activos
    const activeFiltersCount = Object.values(formValues).filter(
        value => value !== '' && value !== false && value !== null && value !== undefined
    ).length

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                {children || (
                    <Button type="button" variant="secondary" className="flex items-center gap-2">
                        <Filter className="size-4" />
                        {isMobile ? '' : 'Filtros'}
                        {showActiveFilters && activeFiltersCount > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="w-[calc(100vw-2rem)] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>
                        {description}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 px-4 py-4">
                    {isOpen && (
                        <form ref={formRef} id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {fields.map((field) => (
                                <DataFilterField
                                    key={field.name}
                                    field={field}
                                    value={formValues[field.name]}
                                    onChange={handleFieldChange}
                                />
                            ))}
                        </form>
                    )}
                </div>

                <SheetFooter className="flex gap-2">
                    <Button
                        type="submit"
                        form={formId}
                        disabled={isFiltering}
                        className="flex items-center gap-2"
                    >
                        {isFiltering ? <Loader2 className="size-4 animate-spin" /> : applyText}
                    </Button>
                    {activeFiltersCount > 0 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClearFilters}
                            disabled={isFiltering}
                            className="flex items-center gap-2"
                        >
                            <X className="size-4" />
                            {clearFiltersText}
                        </Button>
                    )}
                    <SheetClose asChild>
                        <Button variant="outline" type="button">
                            {cancelText}
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export { DataFilterSheet }
export type { DataFilterFields, DataFilterSheetProps }

/*
Ejemplo de uso:

import { DataFilterSheet } from "@/components/data-filter-sheet"

const filterFields = [
  {
    type: 'input' as const,
    name: 'search',
    label: 'Buscar',
    placeholder: 'Buscar por nombre...',
    inputType: 'search'
  },
  {
    type: 'select' as const,
    name: 'status',
    label: 'Estado',
    placeholder: 'Seleccionar estado',
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
      { value: 'pending', label: 'Pendiente' }
    ]
  },
  {
    type: 'radio' as const,
    name: 'priority',
    label: 'Prioridad',
    options: [
      { value: 'low', label: 'Baja' },
      { value: 'medium', label: 'Media' },
      { value: 'high', label: 'Alta' }
    ],
    defaultValue: 'medium'
  },
  {
    type: 'select' as const,
    name: 'category',
    label: 'Categoría',
    optionsUrl: '/api/categories',
    optionsKey: 'id',
    optionsValue: 'name'
  },
  {
    type: 'checkbox' as const,
    name: 'featured',
    label: 'Solo destacados',
    defaultValue: false
  },
  {
    type: 'input' as const,
    name: 'date_from',
    label: 'Fecha desde',
    inputType: 'date'
  },
  {
    type: 'input' as const,
    name: 'date_to',
    label: 'Fecha hasta',
    inputType: 'date'
  }
]

function MyComponent() {
  return (
    <DataFilterSheet
      only={['data']}
      fields={filterFields}
      title="Filtros de productos"
      description="Filtra los productos según tus criterios"
      showActiveFilters={true}
    />
  )
}
*/

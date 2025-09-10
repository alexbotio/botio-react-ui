import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EyeIcon, Loader2Icon, PencilIcon, PlusIcon, RefreshCcw, Undo2Icon } from "lucide-react"
import { useState } from "react"
import { Link } from "@inertiajs/react"

interface DataCreateLinkProps {
    children?: React.ReactNode
    className?: string
    href: string
    disabled?: boolean
    loading?: boolean
}

function DataCreateLink({
    children,
    className,
    href,
    disabled,
    loading,
}: DataCreateLinkProps) {
    return (
        <Button
            asChild
            className={cn("gap-1 flex-1 w-full md:w-auto", className)}
            disabled={disabled || loading}
        >
            <Link href={href}>
                {loading ? (
                    <Loader2Icon className="size-4 animate-spin" />
                ) : (
                    <PlusIcon className="size-4.5" />
                )}
                {children && <span className="hidden md:block">{children}</span>}
            </Link>
        </Button>
    )
}

interface DataBackLinkProps {
    href: string
    label?: string
    className?: string
}

function DataBackLink({ href, label = "Volver", className }: DataBackLinkProps) {
    return (
        <Button variant="secondary" className={cn("w-full md:w-auto", className)} asChild>
            <Link href={href}>
                <Undo2Icon className="size-4" />
                <span className="hidden md:block">{label}</span>
            </Link>
        </Button>
    )
}


interface DataRefreshButtonProps {
    className?: string
    disabled?: boolean
    loading?: boolean
    isDropdownItem?: boolean
    onClickRefresh?: () => void
}

function DataRefreshButton({
    className,
    disabled,
    loading: controlledLoading,
    isDropdownItem,
    onClickRefresh
}: DataRefreshButtonProps) {
    const [internalLoading, setInternalLoading] = useState(false)
    const loading = controlledLoading ?? internalLoading

    const handleRefresh = () => {
        onClickRefresh?.()
        setInternalLoading(true)
        setTimeout(() => {
            window.location.href = window.location.pathname
        }, 1000)
    }

    return (
        <Button
            type="button"
            variant="secondary"
            className={cn("gap-2", className, isDropdownItem && "justify-start bg-transparent hover:bg-accent")}
            onClick={() => handleRefresh()}
            disabled={disabled || loading}
        >
            <RefreshCcw className={cn("size-4", loading && "animate-spin")} />
            {isDropdownItem && <span className="text-foreground">Actualizar</span>}
        </Button>
    )
}

interface DataShowLinkProps {
    className?: string
    href: string
    label?: string
    disabled?: boolean
    loading?: boolean
}

function DataShowLink({ className, href, label, disabled, loading }: DataShowLinkProps) {
    return (
        <Button variant="ghost" size="sm" className={className} disabled={disabled || loading} asChild>
            <Link href={href}>
                <EyeIcon className="size-4" />
                {label && <span>{label}</span>}
            </Link>
        </Button>
    )
}

interface DataEditLinkProps {
    className?: string
    href: string
    disabled?: boolean
    loading?: boolean
    suffix?: string
}

function DataEditLink({ className, href, disabled, loading, suffix }: DataEditLinkProps) {
    return (
        <Button variant="ghost" size="sm" className={className} disabled={disabled || loading} asChild>
            <Link href={href}>
                <PencilIcon className="size-4" />
                {suffix && <span >{suffix}</span>}
            </Link>
        </Button>
    )
}

export {
    DataCreateLink,
    DataBackLink,
    DataEditLink,
    DataRefreshButton,
    DataShowLink,
}

import { cn } from "@/lib/utils"
import { DataSearchInput, DataSearchInputProps } from "./data-search-input"
import { DataFilterSheet, DataFilterFields } from "./data-filter-sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { DataRefreshButton } from "@/components/botio/inertia/data-actions"

interface DataToolbarProps {
    startContent?: React.ReactNode
    endContent?: React.ReactNode
    className?: string
    hideSearch?: boolean
    hideFilters?: boolean
    hideRefresh?: boolean
    filters?: DataFilterFields[]
    only?: string[]
}

function DataToolbarSearch({ className, ...props }: DataSearchInputProps) {
    return (
        <div className={cn("w-full flex-1", className)}>
            <DataSearchInput {...props} />
        </div>
    )
}

function DataToolbar({ startContent, endContent, className, hideSearch = false, hideRefresh = false, hideFilters = false, filters, only }: DataToolbarProps) {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <div className={cn("w-full flex items-center justify-between gap-4", className)}>
                {startContent}
                {!hideSearch && <DataToolbarSearch />}
                {!hideFilters && <DataFilterSheet only={only || []} fields={filters || []} />}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {!hideRefresh && <DropdownMenuItem asChild><DataRefreshButton isDropdownItem /></DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
                {endContent}
            </div>
        )
    }

    return (
        <div className={cn("w-full flex items-center justify-between gap-4", className)}>
            {startContent}
            {!hideSearch && <DataToolbarSearch />}
            {!hideFilters && <DataFilterSheet only={only || []} fields={filters || []} />}
            {!hideRefresh && <DataRefreshButton />}
            {endContent}
        </div>
    )
}

export {
    DataToolbar,
    DataToolbarSearch,
}

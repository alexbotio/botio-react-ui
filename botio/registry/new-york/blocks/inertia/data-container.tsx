import { cn } from "@/lib/utils"

interface DataViewProps {
    children?: React.ReactNode
    className?: string
}

function DataContainer({ children, className }: DataViewProps) {
    return (
        <div className={cn("py-4 px-6 md:px-4 space-y-4", className)}>
            {children}
        </div>
    )
}

export {
    DataContainer,
}


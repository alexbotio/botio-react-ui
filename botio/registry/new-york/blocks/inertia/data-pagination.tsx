import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataPaginationProps {
    page: number;
    pageSize: number;
    totalPages: number;
    totalEntries: number;
    maxEntries?: number;
    only?: string[];
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

function DataPagination({ page, pageSize, totalPages, totalEntries, maxEntries, only = [] }: DataPaginationProps) {
    const currentPageSize = useMemo(() => {
        return PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : PAGE_SIZE_OPTIONS[0]
    }, [pageSize])

    function handlePageChange(page: number, pageSize?: number) {
        const currentQuery = new URLSearchParams(location.search)
        const query = Object.fromEntries(currentQuery.entries())
        query.page = page.toString()

        if (pageSize) {
            query.per_page = pageSize.toString()
        }

        router.get(location.pathname as string, query, {
            preserveState: true,
            replace: true,
            only,
        })
    }

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
            <p className="text-sm">
                Total de registros: {totalEntries}{" "}
                {maxEntries && `/${maxEntries}`}
            </p>
            <div className="flex items-center flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm">Mostrar</span>
                    <Select value={currentPageSize.toString()} onValueChange={(value: string) => handlePageChange(page, parseInt(value))}>
                        <SelectTrigger className="w-fit h-8">
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                            {PAGE_SIZE_OPTIONS.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm">
                        Página {page}/{totalPages}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => handlePageChange(1)}
                        disabled={page === 1}
                        variant="outline"
                        size="icon"
                        className="size-8"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        variant="outline"
                        size="icon"
                        className="size-8"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        variant="outline"
                        size="icon"
                        className="size-8"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={page === totalPages}
                        variant="outline"
                        size="icon"
                        className="size-8"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export { DataPagination, type DataPaginationProps }

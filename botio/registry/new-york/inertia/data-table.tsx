import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataPagination } from "./data-pagination"
import { cn } from "@/lib/utils"

interface DataResponse<T> {
  data: T[]
  current_page: number
  per_page: number
  last_page: number
  total: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data?: TData[] | DataResponse<unknown>,
  noResultsMessage?: string
  only?: string[]
}

function DataTable<TData, TValue>({
  columns,
  data,
  noResultsMessage = "No hay resultados",
  only = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const dataArray = React.useMemo(() => {
    return (Array.isArray(data) ? data : data?.data ?? []) as TData[]
  }, [data])

  const table = useReactTable({
    data: dataArray,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                    return (
                    <TableHead key={header.id}>
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                    )
                })}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    {noResultsMessage}
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
      </div>
      {data && 'current_page' in data && (
        <DataPagination
            page={data.current_page}
            pageSize={data.per_page}
            totalPages={data.last_page}
            totalEntries={data.total}
            only={only}
        />
      )}
    </div>
  )
}

interface DataTableActionsProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode
}

function DataTableActions({ children, className, ...props }: DataTableActionsProps) {
    return (
        <div className={cn("flex items-center justify-end gap-1", className)} {...props}>
            {children}
        </div>
    )
}

export {
  DataTable,
  DataTableActions,
  type DataTableProps,
  type DataResponse,
}

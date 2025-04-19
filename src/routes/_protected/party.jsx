import { Pagination } from '@/components/common/table/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createFileRoute } from '@tanstack/react-router'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'

export const Route = createFileRoute('/_protected/party')({
  component: RouteComponent,
})

function RouteComponent() {
  const data = useMemo(() => [
    { name: 'Jane Doe', age: 28, occupation: 'Software Engineer' },
    { name: 'John Smith', age: 34, occupation: 'Product Manager' },
    { name: 'Alice Johnson', age: 30, occupation: 'Designer' },
  ], [])

  const columns = useMemo(() => [
    {
      Header: 'Name',
      accessorKey: 'name',
    },
    {
      Header: 'Age',
      accessorKey: 'age',
    },
    {
      Header: 'Occupation',
      accessorKey: 'occupation',
    },
  ], [])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex flex-col">
      <div className="p-5 bg-white">
        <Table className="border-spacing-0 border-separate border rounded-xl overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan} className="border-b not-last:border-r">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} className="not-last:[&_td]:border-b">
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} className="not-last:border-r">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 h-2 bg-bg-1" />
      <Pagination />
    </div>
  )
}

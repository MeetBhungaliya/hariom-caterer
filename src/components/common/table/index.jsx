import { Pagination } from '@/components/common/table/pagination'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, Table as TableComponent, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEFAULT_LIMIT } from '@/constants/common'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

function Table({ data, columns, isLoading, totalRecords }) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="h-full flex flex-col overflow-hidden">
        <div className="h-full p-5 pr-3 pt-2 bg-white rounded-xl flex flex-col overflow-hidden">
          <ScrollArea className="h-full pb-2 pr-2" type="always">
            <TableComponent>
              <TableHeader className="sticky top-0 shadow bg-white z-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="border-none hover:bg-white top-0">
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="h-auto p-3 font-semibold text-base"
                        style={header.getSize() === 150 ? { width: '100%' } : { minWidth: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading
                  ? [...Array.from({ length: DEFAULT_LIMIT * 2 })].map((_, index) => (
                      <TableRow key={index} className="not-last:[&_td]:border-b">
                        {columns.map((col, colIndex) => {
                          const randomWidth = `${Math.floor(Math.random() * 50) + 50}%`
                          return (
                            <TableCell
                              key={colIndex}
                              className="px-3"
                              style={col.size ? { minWidth: `${col.size}px` } : { width: '100%' }}
                            >
                              <Skeleton style={{ width: randomWidth }} className="h-[30px]" />
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))
                  : table.getRowModel().rows.map(row => (
                      <TableRow key={row.id} className="not-last:[&_td]:border-b">
                        {row.getVisibleCells().map(cell => (
                          <TableCell
                            key={cell.id}
                            className="px-3"
                            style={cell.column.getSize() === 150 ? { width: '100%' } : { minWidth: `${cell.column.getSize()}px` }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
              </TableBody>
            </TableComponent>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="mt-3 h-2 bg-bg-1" />
        <Pagination totalRecords={totalRecords} />
      </div>
    </div>
  )
}

export { Table }

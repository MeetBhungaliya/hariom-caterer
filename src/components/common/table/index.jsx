import { Pagination } from '@/components/common/table/pagination'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, Table as TableComponent, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEFAULT_LIMIT } from '@/constants/common'
import { useSearch } from '@tanstack/react-router'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

function Table({ data, columns, isLoading, totalRecords }) {
  const search = useSearch({ strict: false })

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const totalPages = Math.ceil(totalRecords / search.limit)
  console.log(totalPages)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className='h-full flex flex-col overflow-hidden'>
        <div className='h-full p-5 pr-3 pt-2 bg-white rounded-xl flex flex-col overflow-hidden'>
          <TableComponent className="w-[calc(100%-8px))]">
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="hover:bg-white top-0">
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="h-auto p-3 font-semibold border-b text-base"
                        style={header.getSize() === 150 ? { width: '100%' } : { minWidth: header.getSize() + 'px' }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
          </TableComponent>
          <div className='h-full w-full flex flex-col overflow-hidden'>
            <ScrollArea className="h-full pr-2">
              <TableComponent>
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
                              style={col.size ? { minWidth: col.size + 'px' } : { width: '100%' }}
                            >
                              <Skeleton style={{ width: randomWidth }} className="h-[30px]" />
                            </TableCell>)
                        })}
                      </TableRow>
                    ))
                    : table.getRowModel().rows.map(row => (
                      <TableRow key={row.id} className="not-last:[&_td]:border-b">
                        {row.getVisibleCells().map(cell => (
                          <TableCell
                            key={cell.id}
                            className="px-3"
                            style={cell.column.getSize() === 150 ? { width: '100%' } : { minWidth: cell.column.getSize() + 'px' }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </TableComponent>
            </ScrollArea>
          </div>
        </div>
        <div className="mt-3 h-2 bg-bg-1" />
        <Pagination />
      </div>
    </div>
  )
}

export { Table }

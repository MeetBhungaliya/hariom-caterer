import { Pagination } from '@/components/common/table/pagination'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, Table as TableComponent, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEFAULT_LIMIT } from '@/constants/common'
import { cn } from '@/lib/utils'
import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import { Fragment } from 'react'

function Table({ data, columns, isLoading, totalRecords, pagination = true, expandableRows = false, SubComponent, isSubTable = false }) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => expandableRows,
    ...expandableRows
      ? { getExpandedRowModel: getExpandedRowModel() }
      : {},
  })

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="h-full flex flex-col overflow-hidden">
        <div className={cn('h-full bg-white flex flex-col overflow-hidden', isSubTable ? 'border rounded-lg' : 'p-5 pr-3 pt-2 rounded-xl',
        )}
        >
          <ScrollArea className={isSubTable ? 'h-[200px]' : 'h-full pb-2 pr-2'} type="always">
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
                  ? [...Array.from({ length: isSubTable ? 3 : DEFAULT_LIMIT * 2 })].map((_, index) => (
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
                  : table.getRowModel().rows.map((row) => {
                      return (
                        <Fragment key={row.id}>
                          <TableRow className={cn('not-last:[&_td]:border-b', isSubTable && 'hover:bg-transparent')}>
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
                          {row.getIsExpanded() && (
                            <TableRow>
                              <TableCell colSpan={row.getVisibleCells().length} className="bg-bg-1">
                                <SubComponent row={row} />
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      )
                    })}
              </TableBody>
            </TableComponent>
            {isSubTable ? null : <ScrollBar orientation="horizontal" />}
          </ScrollArea>
        </div>
        {pagination
          && (
            <>
              <div className="mt-3 h-2 bg-bg-1" />
              <Pagination totalRecords={totalRecords} />
            </>
          )}
      </div>
    </div>
  )
}

export { Table }

import { Pagination } from '@/components/common/table/pagination'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, Table as TableComponent, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DEFAULT_LIMIT } from '@/constants/common'
import { cn } from '@/lib/utils'
import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import { TriangleAlert } from 'lucide-react'
import { Fragment } from 'react'

function Table({
  data,
  columns,
  isLoading,
  totalRecords,
  pagination = true,
  expandableRows = false,
  SubComponent,
  isSubTable = false,
  className
}) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => expandableRows,
    ...(expandableRows ? { getExpandedRowModel: getExpandedRowModel() } : {}),
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="h-full flex flex-col overflow-hidden">
        <div
          className={cn(
            "h-full bg-white flex flex-col overflow-hidden",
            isSubTable
              ? "border rounded-lg"
              : "pl-3 md:pl-5 pr-3 py-2 rounded-xl",
            className
          )}
        >
          <ScrollArea
            className={isSubTable ? "h-[200px]" : "h-full pb-2 pr-2"}
            type="always"
          >
            <TableComponent>
              <TableHeader className="sticky top-0 shadow bg-white z-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-none hover:bg-white top-0"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn(
                            "h-auto p-2 md:p-3 font-semibold text-sm md:text-base",
                            header.id.endsWith("align-center")
                              ? "text-center"
                              : ""
                          )}
                          style={
                            header.getSize() === 150
                              ? { width: "100%" }
                              : { minWidth: `${header.getSize()}px` }
                          }
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [
                    ...Array.from({
                      length: isSubTable ? 3 : DEFAULT_LIMIT * 2,
                    }),
                  ].map((_, index) => (
                    <TableRow key={index} className="not-last:[&_td]:border-b">
                      {columns.map((col, colIndex) => {
                        const randomWidth = `${Math.floor(Math.random() * 50) + 50}%`;
                        return (
                          <TableCell
                            key={colIndex}
                            className="px-3"
                            style={
                              col.size
                                ? { minWidth: `${col.size}px` }
                                : { width: "100%" }
                            }
                          >
                            <Skeleton
                              style={{ width: randomWidth }}
                              className="h-[30px]"
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <Fragment key={row.id}>
                        <TableRow
                          className={cn(
                            "not-last:[&_td]:border-b",
                            isSubTable && "hover:bg-transparent"
                          )}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <TableCell
                                key={cell.id}
                                className={cn(
                                  "px-2 md:px-3 text-xs md:text-sm",
                                  cell.id.endsWith("align-center")
                                    ? "text-center"
                                    : ""
                                )}
                                style={
                                  cell.column.getSize() === 150
                                    ? { width: "100%" }
                                    : { minWidth: `${cell.column.getSize()}px` }
                                }
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                        {row.getIsExpanded() && (
                          <TableRow>
                            <TableCell
                              colSpan={row.getVisibleCells().length}
                              className="bg-bg-1"
                            >
                              <SubComponent row={row} />
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={columns.length} className="py-10">
                      <div className="flex flex-col items-center justify-center gap-y-2">
                        <TriangleAlert className="size-20" />
                        <p className="text-lg font-medium">No data to show</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </TableComponent>
            {isSubTable ? null : <ScrollBar orientation="horizontal" />}
          </ScrollArea>
        </div>
        {pagination && (
          <>
            <div className="mt-2 sm:mt-3 h-2 bg-bg-1" />
            <Pagination totalRecords={totalRecords} />
          </>
        )}
      </div>
    </div>
  );
}

export { Table }

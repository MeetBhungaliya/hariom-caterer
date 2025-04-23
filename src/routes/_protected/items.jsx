import { getItemDetails, getItemList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuthStore } from '@/hooks/use-auth'
import { paginationSchema } from '@/lib/schema/common'
import { cn } from '@/lib/utils'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardPenLine, CornerUpRight, Edit, Search } from 'lucide-react'
import { useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/items')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const { page, limit } = Route.useSearch()

  const isLoading = useAuthStore(state => state.isLoading)
  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const itemList = useQuery(getItemList({ page, limit, search: debouncedSearchedValue }))

  const columns = useMemo(() => [
    {
      id: 'view-crockeries',
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={cn('text-base bg-transparent shadow-none', row.getIsExpanded() ? 'border-[#24b4fb] bg-[#0071e2] text-white [&_svg]:-scale-y-[1]' : 'text-text-1 hover:text-white',
                  )}
                  onClick={row.getToggleExpandedHandler()}
                >
                  <CornerUpRight className="size-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show Crockeries</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      size: 60,
    },
    {
      header: 'Item Id',
      accessorKey: 'item_id',
      size: 200,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      size: 200,
    },
    {
      header: 'Name Hindi',
      accessorKey: 'name_hi',
      size: 200,
    },
    {
      header: 'Price',
      accessorKey: 'price',
      size: 200,
    },
    {
      header: 'Ingredient',
      accessorKey: 'ingredient',
      size: 200,
    },
    {
      header: 'Recipe',
      accessorKey: 'recipe',
      size: 200,
    },
    {
      id: 'actions',
      cell: () => (
        <div className="flex gap-x-4 justify-end">
          <Button onClick={() => {
            // setUpdateCategory({
            //   name: props.row.original.name,
            //   category_id: props.row.original.category_id,
            // })
            // categoryModal.setTrue()
          }}
          >
            <Edit className="size-5" />
          </Button>
        </div>
      ),
      size: 160,
    },
  ], [])

  return (
    <>
      <div className="h-full flex flex-col gap-y-5">
        <div className="bg-white p-4 rounded-xl flex justify-end">
          <searchForm.Field
            name="search"
            listeners={{ onChange: ({ value }) => setValue(value) }}
            children={field => (
              <ControlledInput
                id="search"
                label="Search"
                field={field}
                className="w-full max-w-sm"
                prefix={<Search className="size-5" />}
              />
            )}
          />
          <IconButton icon={<ClipboardPenLine className="size-5" />} label="Add Item" />
        </div>
        <Table
          columns={columns}
          data={itemList.data.result.list}
          isLoading={isLoading || itemList.fetchStatus === 'fetching'}
          totalRecords={itemList.data.result.totalRecords}
          expandableRows={true}
          SubComponent={SubComponent}
        />
      </div>
    </>
  )
}

function SubComponent({ row }) {
  const itemDetails = useQuery(getItemDetails({ item_id: row.original.item_id }))

  const isLoading = useAuthStore(state => state.isLoading)

  const columns = useMemo(() => [
    {
      header: 'Crockery Id',
      accessorKey: 'crockery_id',
      size: 200,
    },
    {
      header: 'Name',
      accessorKey: 'crockery.name',
      size: 200,
    },
    {
      header: 'Name Hindi',
      accessorKey: 'crockery.name_hi',
      size: 200,
    },
    {
      header: 'Person',
      accessorKey: 'crockery.person',
      size: 200,
    },
    {
      header: 'Quantity',
      accessorKey: 'crockery.quantity',
      size: 200,
    },
  ], [])

  return (
    <Table
      columns={columns}
      data={itemDetails.data.result.crockery}
      isLoading={isLoading || itemDetails.fetchStatus === 'fetching'}
      pagination={false}
      expandableRows={true}
      SubComponent={SubComponent}
      isSubTable={true}
    />
  )
}

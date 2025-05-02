import { getItemList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import { Table } from '@/components/common/table'
import { SubComponent } from '@/components/sub-component'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/hooks/use-auth'
import { paginationSchema } from '@/lib/schema/common'
import { cn } from '@/lib/utils'
import { AddEditItemModal } from '@/modals/item'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardPenLine, CornerUpRight, Edit, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useBoolean, useDebounceValue } from 'usehooks-ts'
import { Route as AddItemRoute } from './add'
import { Route as UpdateItemRoute } from './$item_id'
import Img from '@/components/img'
import ImageViewer_Motion from '@/components/commerce-ui/image-viewer-motion'

export const Route = createFileRoute('/_protected/items/')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const [updateItem, setUpdateItem] = useState()

  const { page, limit } = Route.useSearch()
  const navigate = Route.useNavigate()
  const itemModal = useBoolean(false)

  const isLoading = useAuthStore(state => state.isLoading)
  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const itemList = useQuery(getItemList({ page, limit, search: debouncedSearchedValue }))

  const columns = useMemo(() => [
    {
      id: 'view-crockeries',
      cell: ({ row }) => {
        return (
          <Button
            className={cn('text-base bg-transparent shadow-none border', row.getIsExpanded() ? 'border-sky-600 hover:border-sky-600 bg-sky-600 text-white [&_svg]:-scale-y-[1]' : 'text-sky-600 hover:text-white',
            )}
            onClick={row.getToggleExpandedHandler()}
          >
            <CornerUpRight className="size-4" />
          </Button>
        )
      },
      size: 60,
    },
    {
      id: 'image-align-center',
      header: '',
      accessorKey: 'image',
      size: 200,
      cell: ({ row }) => (
        <ImageViewer_Motion
          thumbnailComponent={<Img containerClassName="mx-auto size-10" imgProps={{ src: row.getValue("image-align-center") }} />}
          imageUrl={row.getValue("image-align-center")}
          className="max-w-[300px]"
        />)
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
      cell: (props) => (
        <div className="flex gap-x-4 justify-end">
          <Button onClick={() => {
            setUpdateItem(props.row.original)
            navigate({
              to: UpdateItemRoute.fullPath,
              params: { item_id: props.row.original.item_id },
              state: props.row.original
            })
          }}
          >
            <Edit className="size-4" />
          </Button>
        </div>
      ),
      size: 160,
    },
  ], [])

  if (itemList.isError)
    return null

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
          <IconButton icon={<ClipboardPenLine className="size-5" />} label="Add Item" onClick={() => navigate({ to: AddItemRoute.fullPath })} />
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

      <AddEditItemModal modalState={itemModal} data={updateItem} setData={setUpdateItem} />
    </>
  )
}

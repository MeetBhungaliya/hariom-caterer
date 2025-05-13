import { getPackageItemList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/hooks/use-auth'
import { AddEditPackageItem } from '@/modals/package-item'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, PackagePlus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useBoolean, useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/package/item')({
  component: RouteComponent,
})

function RouteComponent() {
  const [updatePackageItem, setUpdatePackageItem] = useState()

  const searchForm = useForm()

  const isLoading = useAuthStore(state => state.isLoading)
  const { page, limit } = Route.useSearch()
  const packageItemModal = useBoolean(false)

  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const packageItemList = useQuery(getPackageItemList({ page, limit, search: debouncedSearchedValue }))

  const columns = useMemo(() => [
    {
      header: 'Package Item Id',
      accessorKey: 'pim_id',
      size: 200,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      size: 200,
    },
    {
      id: 'actions',
      cell: props => (
        <Button onClick={() => {
          setUpdatePackageItem({
            name: props.row.original.name,
            pim_id: props.row.original.pim_id,
            categories: props.row.original.category
          })
          packageItemModal.setTrue()
        }}
        >
          <Edit className="size-4" />
        </Button>
      ),
      size: 62,
    },
  ], [])

  if (packageItemList.isError)
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
          <IconButton icon={<PackagePlus className="size-5" />} label="Add Package Item" onClick={packageItemModal.setTrue} />
        </div>
        <Table
          columns={columns}
          data={packageItemList.data.result.list}
          isLoading={isLoading || packageItemList.fetchStatus === 'fetching'}
          totalRecords={packageItemList.data.result.totalRecords}
        />
      </div>

      <AddEditPackageItem modalState={packageItemModal} data={updatePackageItem} setData={setUpdatePackageItem} />
    </>
  )
}

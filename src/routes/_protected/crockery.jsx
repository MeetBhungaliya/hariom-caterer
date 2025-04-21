import { getCrockeryList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/hooks/use-auth'
import { paginationSchema } from '@/lib/schema/common'
import AddEditCrockery from '@/modals/crockery'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, Search, UtensilsCrossed } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useBoolean, useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/crockery')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const [updateCrockery, setUpdateCrockery] = useState()

  const { page, limit } = Route.useSearch()
  const crockeryModal = useBoolean(false)

  const isLoading = useAuthStore(state => state.isLoading)
  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const crockeryList = useQuery(getCrockeryList({ page, limit, search: debouncedSearchedValue }))

  const columns = useMemo(() => [
    {
      header: 'Crockery Id',
      accessorKey: 'crockery_id',
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
      header: 'Person',
      accessorKey: 'person',
      size: 200,
    },
    {
      header: 'Quantity',
      accessorKey: 'quantity',
      size: 200,
    },
    {
      id: 'actions',
      cell: props => (
        <Button onClick={() => {
          setUpdateCrockery({
            name: props.row.original.name,
            name_hi: props.row.original.name_hi,
            person: props.row.original.person,
            quantity: props.row.original.quantity,
            crockery_id: props.row.original.crockery_id,
          })
          crockeryModal.setTrue()
        }}
        >
          <Edit className="size-5" />
        </Button>
      ),
      size: 62,
    },
  ], [])

  if (crockeryList.isError)
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
          <IconButton icon={<UtensilsCrossed className="size-5" />} label="Add Crockery" onClick={crockeryModal.setTrue} />
        </div>
        <Table
          columns={columns}
          data={crockeryList.data.result.list}
          isLoading={isLoading || crockeryList.fetchStatus === 'fetching'}
          totalRecords={crockeryList.data.result.totalRecords}
        />
      </div>

      <AddEditCrockery modalState={crockeryModal} data={updateCrockery} setData={setUpdateCrockery} />
    </>
  )
}

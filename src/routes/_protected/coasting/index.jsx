import { getOrdersList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import { Table } from '@/components/common/table'
import { useAuthStore } from '@/hooks/use-auth'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { HandCoins, Search } from 'lucide-react'
import moment from 'moment'
import { useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { Route as AddCoastingRoute } from './add'

export const Route = createFileRoute('/_protected/coasting/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { page, limit } = Route.useSearch()

  const isLoading = useAuthStore(state => state.isLoading)

  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const ordersList = useQuery(getOrdersList({ page, limit, search: debouncedSearchedValue, status: "costing" }))

  const columns = useMemo(() => [
    {
      header: 'Order Id',
      accessorKey: 'order_id',
      size: 200,
    },
    {
      header: 'Client Name',
      accessorKey: 'client.name',
      size: 200,
    },
    {
      header: 'Date & Time',
      accessorKey: 'date',
      cell: props => (
        <span>
          {moment(props.getValue()).format('DD-MM-YYYY')}
          &nbsp;/&nbsp;
          {props.row.original.time}
        </span>
      ),
      size: 200,
    },
    {
      header: 'Person',
      accessorKey: 'person',
      size: 200,
    },
    {
      header: 'Venue',
      accessorKey: 'venue',
      size: 200,
    },
    {
      header: 'Jain Counter',
      accessorKey: 'jain_counter',
      size: 200,
    },
    {
      header: 'Per Plate Cost',
      accessorKey: 'per_plate_cost',
      size: 200,
    },
    {
      header: 'Selling Price',
      accessorKey: 'selling_price',
      size: 200,
    },
    {
      header: 'Pro',
      accessorKey: 'pro',
      size: 200,
    },
    {
      header: 'Bom Boys',
      accessorKey: 'bom_boys',
      size: 200,
    },
    {
      header: 'Packed Bottle',
      accessorKey: 'packed_bottle',
      size: 200,
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
          <IconButton icon={<HandCoins className="size-5" />} label="Add Coasting" onClick={() => navigate({ to: AddCoastingRoute.fullPath })} />
        </div>
        <Table
          columns={columns}
          data={ordersList.data.result.list}
          isLoading={isLoading || ordersList.fetchStatus === 'fetching'}
          totalRecords={ordersList.data.result.totalRecords}
        />
      </div>
    </>
  )
}

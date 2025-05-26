import { getOrdersList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from '@/hooks/use-auth'
import { paginationSchema, STATUS_OPTIONS, statusSchema } from '@/lib/schema/common'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, HandCoins, Search } from 'lucide-react'
import moment from 'moment'
import { useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { Route as UpdateOrderRoute } from './$order_id'
import { Route as AddCoastingRoute } from './add'
import { UPDATE_COASTING } from '@/constants/endpoints'
import { METHODS } from '@/constants/common'
import { fetchApi } from '@/lib/api'
import { asyncResponseToaster } from '@/lib/toasts'
import NoData from '@/components/common/NoData'

export const Route = createFileRoute('/_protected/coasting/')({
  component: RouteComponent,
  validateSearch: search => {
    const schema = statusSchema.merge(paginationSchema)
    return schema.parse(search)
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const { page, limit, status } = Route.useSearch()

  const isLoading = useAuthStore(state => state.isLoading)

  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const ordersList = useQuery(getOrdersList({ page, limit, search: debouncedSearchedValue, status }))

  const updateCoastingMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_COASTING, method: METHODS.PUT, data }),
  })

  const handleAcceptOrder = async (order_id) => {
    const result = await asyncResponseToaster(() => updateCoastingMutation.mutateAsync({ order_id, status: STATUS_OPTIONS.at(0).value }))

    if (result.success && result.value && result.value.ResponseCode === 1) {
      ordersList.refetch()
    }
  }

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
    {
      id: 'actions',
      cell: (props) => (
        <div className="flex gap-x-4 justify-end">
          <Button className="text-sm" onClick={() => handleAcceptOrder(props.row.original.order_id)}
          >
            Accept Order
          </Button>
          <Button onClick={() => {
            navigate({
              to: UpdateOrderRoute.fullPath,
              params: { order_id: props.row.original.order_id },
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

  if (ordersList.isError)
    return null

  return (
    <>
      <div className="h-full flex flex-col gap-y-5">
        <div className="bg-white p-4 rounded-xl flex justify-end gap-x-4">
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
          <Select defaultValue={status} onValueChange={(value) => navigate({ search: { status: value } })}>
            <SelectTrigger icon className="w-full max-w-[140px] !h-full gap-3 p-0 pl-4 text-sm md:text-base justify-start font-medium rounded-lg data-[placeholder]:text-gray-500 border-gray-300">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent align="middle" className="min-w-20">
              {STATUS_OPTIONS.map((item, key) => (
                <SelectItem key={key} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <IconButton icon={<HandCoins className="size-5" />} label="Add Coasting" onClick={() => navigate({ to: AddCoastingRoute.fullPath })} />
        </div>

        {ordersList.data.result.list.length || isLoading || ordersList.fetchStatus === 'fetching' ?
          <Table
            columns={columns}
            data={ordersList.data.result.list}
            isLoading={isLoading || ordersList.fetchStatus === 'fetching'}
            totalRecords={ordersList.data.result.totalRecords}
          />
          : <NoData />
        }
      </div>
    </>
  )
}

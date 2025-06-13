import { getOrdersList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import NoData from '@/components/common/NoData'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { METHODS } from '@/constants/common'
import { CONVERT_TO_ORDER, GET_ORDERS, PRINT_CROCKERY, PRINT_ORDER } from '@/constants/endpoints'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { paginationSchema, STATUS_OPTIONS, statusSchema } from '@/lib/schema/common'
import { asyncResponseToaster } from '@/lib/toasts'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, HandCoins, Search } from 'lucide-react'
import moment from 'moment'
import { useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { Route as UpdateOrderRoute } from './$order_id'
import { Route as AddCoastingRoute } from './add'
import { printPDF } from '@/lib/utils'

export const Route = createFileRoute('/_protected/coasting/')({
  component: RouteComponent,
  validateSearch: search => {
    const schema = statusSchema.merge(paginationSchema)
    return schema.parse(search)
  },
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()

  const { page, limit, status } = Route.useSearch()

  const isLoading = useAuthStore(state => state.isLoading)

  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const ordersList = useQuery(getOrdersList({ page, limit, search: debouncedSearchedValue, status }))

  const updateOrderStatusMutation = useMutation({
    mutationFn: async data => fetchApi({ url: CONVERT_TO_ORDER, method: METHODS.PUT, data }),
  })

  const printCrockeryMutation = useMutation({
    mutationFn: async order_id => fetchApi({ url: `${PRINT_CROCKERY}?order_id=${order_id}`}),
  })

  const printOrderMutation = useMutation({
    mutationFn: async order_id => fetchApi({ url: `${PRINT_ORDER}?order_id=${order_id}`}),
  })

  const handleAcceptOrder = async (order_id) => {
    const result = await asyncResponseToaster(() => updateOrderStatusMutation.mutateAsync({ order_id, status: STATUS_OPTIONS.at(0).value }))

    if (result.success && result.value && result.value.ResponseCode === 1) {
      ordersList.refetch()
      queryClient.invalidateQueries({ queryKey: GET_ORDERS })
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "Order Id",
        accessorKey: "order_id",
        size: 200,
      },
      {
        header: "Client Name",
        accessorKey: "client.name",
        size: 200,
      },
      {
        header: "Date & Time",
        accessorKey: "date",
        cell: (props) => (
          <span>
            {moment(props.getValue()).format("DD-MM-YYYY")}
            &nbsp;/&nbsp;
            {props.row.original.time}
          </span>
        ),
        size: 200,
      },
      {
        header: "Person",
        accessorKey: "person",
        size: 200,
      },
      {
        header: "Venue",
        accessorKey: "venue",
        size: 200,
      },
      {
        id: "actions",
        cell: (props) => (
          <div className="flex gap-x-4 justify-end">
            {status === STATUS_OPTIONS.at(1).value ? (
              <>
                <Button
                  className="text-sm"
                  onClick={() => handleAcceptOrder(props.row.original.order_id)}
                >
                  Accept Order
                </Button>
                <Button
                  className="text-sm"
                  onClick={async () => {
                    const res = await printCrockeryMutation.mutateAsync(
                      props.row.original.order_id
                    );
                    printPDF(res.result.url);
                  }}
                >
                  Print Crockery
                </Button>
              </>
            ) : null}
            <Button
              className="text-sm"
              onClick={async () => {
                const res = await printOrderMutation.mutateAsync(
                  props.row.original.order_id
                );
                printPDF(res.result.url);
              }}
            >
              Print Order
            </Button>
            <Button
              className="px-[10px]"
              onClick={() => {
                navigate({
                  to: UpdateOrderRoute.fullPath,
                  params: { order_id: props.row.original.order_id },
                  state: props.row.original,
                });
              }}
            >
              <Edit className="size-4" />
            </Button>
          </div>
        ),
        size: 160,
      },
    ],
    [status]
  );

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

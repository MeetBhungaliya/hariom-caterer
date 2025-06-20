import { IconButton } from '@/components/common/btn-with-icon'
import { createFileRoute } from '@tanstack/react-router'
import { Boxes, CornerUpRight, Edit, Search } from 'lucide-react'
import { Route as AddFunctionRoute } from './add'
import { useQuery } from '@tanstack/react-query'
import { getFunctionsList } from '@/api/query-option'
import { useForm } from '@tanstack/react-form'
import { useDebounceValue } from 'usehooks-ts'
import { useAuthStore } from '@/hooks/use-auth'
import { paginationSchema } from '@/lib/schema/common'
import { ControlledInput } from '@/components/common/controlled-input'
import moment from 'moment'
import { useMemo } from 'react'
import { Table } from '@/components/common/table'
import { SubComponent } from '@/components/sub-function-component'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Route as EditRoute } from './edit'

export const Route = createFileRoute('/_protected/function/')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { page, limit } = Route.useSearch()

  const isLoading = useAuthStore(state => state.isLoading)

  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const funtionsList = useQuery(getFunctionsList({ page, limit, search: debouncedSearchedValue }))

  const columns = useMemo(
    () => [
      {
        id: 'view-functions',
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
        header: "Function Id",
        accessorKey: "function_id",
        size: 200,
      },
      {
        header: "Client Name",
        accessorKey: "client.name",
        size: 200,
      },
      {
        header: "Start/End Date",
        accessorKey: "date",
        cell: (props) => {
          const sortedDates = props.row.original.function_detail.map(d => d.date).slice().sort((a, b) => new Date(a) - new Date(b))
          return (
            <span>
              {moment(sortedDates.at(0)).format("DD-MM-YYYY")}
              &nbsp;/&nbsp;
              {moment(sortedDates.at(-1)).format("DD-MM-YYYY")}
            </span>
          )
        },
        size: 200,
      },
      {
        header: "Venue",
        accessorKey: "venue",
        size: 200,
      },
      {
        header: "Total Amount",
        accessorKey: "total_amount",
        size: 200,
      },
      {
        id: 'actions',
        cell: props => (
          <Button onClick={() => navigate({ to: EditRoute.fullPath, state: props.row.original })}>
            <Edit className="size-4" />
          </Button>
        ),
        size: 62,
      },
    ],
    []
  );

  if (funtionsList.isError)
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
          <IconButton icon={<Boxes className="size-5" />} label="Add Function" onClick={() => navigate({ to: AddFunctionRoute.fullPath })} />
        </div>

        {funtionsList.data.result.list.length || isLoading || funtionsList.fetchStatus === 'fetching' ?
          <Table
            columns={columns}
            data={funtionsList.data.result.list}
            isLoading={isLoading || funtionsList.fetchStatus === 'fetching'}
            totalRecords={funtionsList.data.result.totalRecords}
            expandableRows={true}
            SubComponent={SubComponent}
          />
          : <NoData />
        }
      </div>
    </>
  )
}

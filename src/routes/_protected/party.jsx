import { getPartiesList } from '@/api/query-option'
import { Table } from '@/components/common/table'
import { paginationSchema } from '@/lib/schema/common'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import moment from 'moment'
import { useMemo } from 'react'

export const Route = createFileRoute('/_protected/party')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const partyLists = useQuery(getPartiesList)

  const columns = useMemo(() => [
    {
      header: 'Client Id',
      accessorKey: 'client_id',
      size: 200,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      size: 200,
    },
    {
      header: 'Phone Number',
      accessorKey: 'phone',
      size: 200,
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: props => moment(props.getValue()).format('LLL'),
      size: 200,
    },
  ], [])



  if (partyLists.isError)
    return null

  return <Table
    columns={columns}
    data={partyLists.data.result.list}
    isLoading={!partyLists.data.result.list.length || partyLists.fetchStatus === "fetching"}
    totalRecords={partyLists.data.result.totalRecords}
  />
}

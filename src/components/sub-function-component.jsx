import { useMemo } from 'react'
import { Table } from './common/table'
import moment from 'moment'

function SubComponent({ row }) {
  const columns = useMemo(() => [
    {
      header: 'Id',
      accessorKey: 'fdm_id',
      size: 200,
    },
    {
      header: 'Function',
      accessorKey: 'function',
      size: 200,
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (props) => moment(props.row.original.date).format("DD-MM-YYYY"),
      size: 200,
    },
    {
      header: 'Person',
      accessorKey: 'person',
      size: 200,
    },
    {
      header: 'Rate',
      accessorKey: 'rate',
      size: 200,
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      size: 200,
    },
  ], [])

  return (
    <Table
      columns={columns}
      data={row.original.function_detail}
      isLoading={false}
      pagination={false}
      expandableRows={true}
      SubComponent={SubComponent}
      isSubTable={true}
    />
  )
}

export { SubComponent }


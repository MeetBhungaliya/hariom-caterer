import { useMemo } from 'react'
import { Table } from './common/table'

function SubComponent({ row }) {
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
    }
  ], [])

  return (
    <Table
      columns={columns}
      data={row.original.crockery_item}
      pagination={false}
      expandableRows={true}
      SubComponent={SubComponent}
      isSubTable={true}
    />
  )
}

export { SubComponent }


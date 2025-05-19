import { getItemDetails } from '@/api/query-option'
import { useAuthStore } from '@/hooks/use-auth'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Table } from './common/table'

function SubComponent({ row }) {
  const itemDetails = useQuery(getItemDetails({ item_id: row.original.item_id }))

  const isLoading = useAuthStore(state => state.isLoading)

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
    },
    {
      header: 'Person',
      accessorKey: 'crockery.person',
      size: 200,
    },
    {
      header: 'Quantity',
      accessorKey: 'crockery.quantity',
      size: 200,
    },
  ], [])

  return (
    <Table
      columns={columns}
      data={itemDetails.data.result.crockery}
      isLoading={isLoading || itemDetails.fetchStatus === 'fetching'}
      pagination={false}
      expandableRows={true}
      SubComponent={SubComponent}
      isSubTable={true}
    />
  )
}

export { SubComponent }

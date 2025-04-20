import { getPartiesList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { paginationSchema } from '@/lib/schema/common'
import { AddEditParty } from '@/modals/party'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, PlusCircle } from 'lucide-react'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { useBoolean } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/party')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const [updateParty, setUpdateParty] = useState()

  const { page, limit } = Route.useSearch()
  const partyLists = useQuery(getPartiesList({ page, limit }))
  const partyModal = useBoolean(false)

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
    {
      id: 'actions',
      cell: props => (
        <Button onClick={() => {
          setUpdateParty({
            name: props.row.original.name,
            phone: props.row.original.phone,
            client_id: props.row.original.client_id,
          })
          partyModal.setTrue()
        }}
        >
          <Edit />
        </Button>
      ),
      size: 68,
    },
  ], [])

  if (partyLists.isError)
    return null

  return (
    <>
      <div className="h-full flex flex-col gap-y-2">

        <div className="bg-white p-4 rounded-xl flex justify-end">
          <IconButton icon={<PlusCircle className="size-5" />} label="Add Client" onClick={partyModal.setTrue} />
        </div>

        <Table
          columns={columns}
          data={partyLists.data.result.list}
          isLoading={!partyLists.data.result.list.length || partyLists.fetchStatus === 'fetching'}
          totalRecords={partyLists.data.result.totalRecords}
        />
      </div>

      <AddEditParty modalState={partyModal} data={updateParty} setData={setUpdateParty} />
    </>
  )
}

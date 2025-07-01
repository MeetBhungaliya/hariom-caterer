import { getPartiesList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import NoData from '@/components/common/NoData'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/hooks/use-auth'
import { paginationSchema } from '@/lib/schema/common'
import { AddEditParty } from '@/modals/party'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Edit, UserRound } from 'lucide-react'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
``
export const Route = createFileRoute('/_protected/party')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const [updateParty, setUpdateParty] = useState()

  const partyModal = useBoolean(false)
  const { page, limit } = Route.useSearch()
  const isLoading = useAuthStore(state => state.isLoading)
  const partyList = useQuery(getPartiesList({ page, limit }))

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
          <Edit className="size-3.5 md:size-4" />
        </Button>
      ),
      size: 62,
    },
  ], [])

  if (partyList.isError)
    return null

  return (
    <>
      <div className="h-full flex flex-col gap-y-3 md:gap-y-6">
        <div className="bg-white p-2 md:p-4 rounded-lg md:rounded-xl flex justify-end gap-2 md:gap-4">
          <IconButton icon={<UserRound className="size-5" />} label="Add Party" onClick={partyModal.setTrue} />
        </div>
        {partyList.data.result.list.length || isLoading || partyList.fetchStatus === 'fetching' ?
          <Table
            columns={columns}
            data={partyList.data.result.list}
            isLoading={isLoading || partyList.fetchStatus === 'fetching'}
            totalRecords={partyList.data.result.totalRecords}
          />
          : <NoData />
        }
      </div>

      <AddEditParty modalState={partyModal} data={updateParty} setData={setUpdateParty} />
    </>
  )
}

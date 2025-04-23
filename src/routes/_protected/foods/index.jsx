import { getCategoryList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import { Table } from '@/components/common/table'
import { Button, buttonVariants } from '@/components/ui/button'
import { pagination } from '@/constants/common'
import { useAuthStore } from '@/hooks/use-auth'
import { paginationSchema } from '@/lib/schema/common'
import { cn } from '@/lib/utils'
import { AddEditCategoryModal } from '@/modals/category'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Apple, Edit, Eye, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useBoolean, useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/foods/')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const [updateCategory, setUpdateCategory] = useState()

  const { page, limit } = Route.useSearch()
  const categoryModal = useBoolean(false)

  const isLoading = useAuthStore(state => state.isLoading)
  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const categoryList = useQuery(getCategoryList({ page, limit, search: debouncedSearchedValue }))

  const columns = useMemo(() => [
    {
      header: 'Category Id',
      accessorKey: 'category_id',
      size: 200,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      size: 200,
    },
    {
      id: 'actions',
      cell: props => (
        <div className="flex gap-x-4 justify-end">
          <Button onClick={() => {
            setUpdateCategory({
              name: props.row.original.name,
              category_id: props.row.original.category_id,
            })
            categoryModal.setTrue()
          }}
          >
            <Edit className="size-5" />
          </Button>
          <Link className={cn(buttonVariants())} to={props.row.original.category_id} search={{ ...pagination, name: props.row.original.name }}>
            <Eye className="size-5" />
          </Link>
        </div>
      ),
      size: 112,
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
          <IconButton icon={<Apple className="size-5" />} label="Add Category" onClick={categoryModal.setTrue} />
        </div>
        <Table
          columns={columns}
          data={categoryList.data.result.list}
          isLoading={isLoading || categoryList.fetchStatus === 'fetching'}
          totalRecords={categoryList.data.result.totalRecords}
        />
      </div>

      <AddEditCategoryModal modalState={categoryModal} data={updateCategory} setData={setUpdateCategory} />
    </>
  )
}

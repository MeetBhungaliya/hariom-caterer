import { getSubCategoryList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/hooks/use-auth'
import AddEditSubcategoryModal from '@/modals/subcategory'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardList, Edit, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useBoolean, useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/foods/$category-id')({
  component: RouteComponent,
})

function RouteComponent() {
  const [updateSubCategory, setUpdateSubCategory] = useState()

  const { name, page, limit } = Route.useSearch()
  const params = Route.useParams()
  const subCategoryModal = useBoolean(false)

  const isLoading = useAuthStore(state => state.isLoading)
  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const subCategoryList = useQuery(getSubCategoryList({ page, limit, category_id: params['category-id'], search: debouncedSearchedValue }))

  const columns = useMemo(() => [
    {
      header: 'Subcategory Id',
      accessorKey: 'scm_id',
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
        <div className="flex justify-end">
          <Button onClick={() => {
            setUpdateSubCategory({
              name: props.row.original.name,
              category_id: props.row.original.category_id,
              scm_id: props.row.original.scm_id,
            })
            subCategoryModal.setTrue()
          }}
          >
            <Edit className="size-5" />
          </Button>
        </div>
      ),
      size: 62,
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
          <IconButton icon={<ClipboardList className="size-5" />} label={`Add ${name || 'Subcategory'}`} onClick={subCategoryModal.setTrue} />
        </div>
        <Table
          columns={columns}
          data={subCategoryList.data.result.list}
          isLoading={isLoading || subCategoryList.fetchStatus === 'fetching'}
          totalRecords={subCategoryList.data.result.totalRecords}
        />
      </div>

      <AddEditSubcategoryModal modalState={subCategoryModal} data={updateSubCategory} setData={setUpdateSubCategory} />
    </>
  )
}

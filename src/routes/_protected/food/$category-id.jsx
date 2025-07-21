import { getSubCategoryList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import NoData from '@/components/common/NoData'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { METHODS } from '@/constants/common'
import { DELETE_SUBCATEGORY } from '@/constants/endpoints'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { asyncResponseToaster } from '@/lib/toasts'
import DeleteModal from '@/modals/delete'
import AddEditSubcategoryModal from '@/modals/subcategory'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ClipboardList, Edit, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useBoolean, useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/food/$category-id')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const [updateSubCategory, setUpdateSubCategory] = useState()
   const [deleteCategory, setDeleteCategory] = useState({
    open: false,
    data: null,
  });

  const { name, page, limit } = Route.useSearch()
  const subCategoryModal = useBoolean(false)

  const isLoading = useAuthStore(state => state.isLoading)
  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const subCategoryList = useQuery(getSubCategoryList({ page, limit, category_id: params['category-id'], search: debouncedSearchedValue }))

  const deleteCategoryMutation = useMutation({
    mutationFn: async (scm_id) =>
      fetchApi({
        url: `${DELETE_SUBCATEGORY}?scm_id=${scm_id}`,
        method: METHODS.DELETE,
      }),
  });

  const onCategoryItem = async (scm_id) => {
    const result = await asyncResponseToaster(() =>
      deleteCategoryMutation.mutateAsync(scm_id)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      subCategoryList.refetch();
      setDeleteCategory((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setDeleteCategory((prev) => ({ ...prev, data: null }));
      }, 150);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Subcategory Id",
        cell: (props) => props.row.index + 1 + (page - 1) * limit,
        size: 200,
      },
      {
        header: "Name",
        accessorKey: "name",
        size: 200,
      },
      {
        id: "actions",
        cell: (props) => (
          <div className="flex gap-x-2 md:gap-x-4 justify-end">
            <Button
              onClick={() => {
                setUpdateSubCategory({
                  name: props.row.original.name,
                  category_id: props.row.original.category_id,
                  scm_id: props.row.original.scm_id,
                });
                subCategoryModal.setTrue();
              }}
            >
              <Edit className="size-3.5 md:size-4" />
            </Button>
            <Button
              onClick={() =>
                setDeleteCategory({
                  open: true,
                  data: {
                    name: props.row.original.name,
                    category_id: props.row.original.category_id,
                  },
                })
              }
            >
              <Trash2 className="size-3.5 md:size-4" />
            </Button>
          </div>
        ),
        size: 62,
      },
    ],
    [page, limit]
  );

  if (subCategoryList.isError)
    return null

  return (
    <>
      <div className="h-full flex flex-col gap-y-3 md:gap-y-6">
        <div className="bg-white p-2 md:p-4 rounded-lg md:rounded-xl flex justify-end gap-2 md:gap-4">
          <searchForm.Field
            name="search"
            listeners={{ onChange: ({ value }) => setValue(value) }}
            children={(field) => (
              <ControlledInput
                id="search"
                label="Search"
                field={field}
                className="w-full max-w-sm"
                prefix={<Search className="size-5" />}
              />
            )}
          />
          <IconButton
            icon={<ClipboardList className="size-5" />}
            label={`Add ${name || "Subcategory"}`}
            onClick={subCategoryModal.setTrue}
          />
        </div>
        {subCategoryList.data.result.list.length ||
        isLoading ||
        subCategoryList.fetchStatus === "fetching" ? (
          <Table
            columns={columns}
            data={subCategoryList.data.result.list}
            isLoading={isLoading || subCategoryList.fetchStatus === "fetching"}
            totalRecords={subCategoryList.data.result.totalRecords}
          />
        ) : (
          <NoData />
        )}
      </div>

      <AddEditSubcategoryModal
        modalState={subCategoryModal}
        data={updateSubCategory}
        setData={setUpdateSubCategory}
      />

      <DeleteModal
        state={deleteCategory}
        Icon={ClipboardList}
        name="Subcategory"
        title={deleteCategory?.data?.name}
        onClose={() => setDeleteCategory({ open: false, data: null })}
        onSucess={() => onCategoryItem(deleteCategory.data.category_id)}
        isLoading={deleteCategoryMutation.isPending}
      />
    </>
  );
}

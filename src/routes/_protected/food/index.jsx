import { getCategoryList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledInput } from '@/components/common/controlled-input'
import NoData from '@/components/common/NoData'
import { Table } from '@/components/common/table'
import { SubComponent } from '@/components/sub-food-component'
import { Button, buttonVariants } from '@/components/ui/button'
import { METHODS, pagination } from '@/constants/common'
import { DELETE_CATEGORY } from '@/constants/endpoints'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { paginationSchema } from '@/lib/schema/common'
import { asyncResponseToaster } from '@/lib/toasts'
import { cn } from '@/lib/utils'
import { AddEditCategoryModal } from '@/modals/category'
import DeleteModal from '@/modals/delete'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Apple, CornerUpRight, Edit, Eye, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useBoolean, useDebounceValue } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/food/')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const [updateCategory, setUpdateCategory] = useState()

  const { page, limit } = Route.useSearch()
  const categoryModal = useBoolean(false)

  const [deleteCategory, setDeleteCategory] = useState({
    open: false,
    data: null,
  });

  const isLoading = useAuthStore(state => state.isLoading)
  const searchForm = useForm()
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500)

  const categoryList = useQuery(getCategoryList({ page, limit, search: debouncedSearchedValue }))

  const deleteCategoryMutation = useMutation({
    mutationFn: async (category_id) =>
      fetchApi({
        url: `${DELETE_CATEGORY}?category_id=${category_id}`,
        method: METHODS.DELETE,
      }),
  });

  const onCategoryItem = async (category_id) => {
    const result = await asyncResponseToaster(() =>
      deleteCategoryMutation.mutateAsync(category_id)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      categoryList.refetch();
      setDeleteCategory((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setDeleteCategory((prev) => ({ ...prev, data: null }));
      }, 150);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "view-crockeries",
        cell: ({ row }) => {
          return (
            <Button
              className={cn(
                "text-base bg-transparent shadow-none border",
                row.getIsExpanded()
                  ? "border-sky-600 hover:border-sky-600 bg-sky-600 text-white [&_svg]:-scale-y-[1]"
                  : "text-sky-600 hover:text-white"
              )}
              onClick={row.getToggleExpandedHandler()}
            >
              <CornerUpRight className="size-3.5 md:size-4" />
            </Button>
          );
        },
        size: 60,
      },
      {
        header: "Category Id",
        accessorKey: "category_id",
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
                setUpdateCategory({
                  name: props.row.original.name,
                  category_id: props.row.original.category_id,
                  crockery_item: props.row.original.crockery_item,
                });
                categoryModal.setTrue();
              }}
            >
              <Edit className="size-3.5 md:size-4" />
            </Button>
            <Link
              className={cn(buttonVariants())}
              to={props.row.original.category_id}
              search={{ ...pagination, name: props.row.original.name }}
            >
              <Eye className="size-3.5 md:size-4" />
            </Link>
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
        size: 112,
      },
    ],
    []
  );

  if (categoryList.isError)
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
            icon={<Apple className="size-5" />}
            label="Add Category"
            onClick={categoryModal.setTrue}
          />
        </div>
        {categoryList.data.result.list.length ||
        isLoading ||
        categoryList.fetchStatus === "fetching" ? (
          <Table
            columns={columns}
            data={categoryList.data.result.list}
            isLoading={isLoading || categoryList.fetchStatus === "fetching"}
            totalRecords={categoryList.data.result.totalRecords}
            expandableRows={true}
            SubComponent={SubComponent}
          />
        ) : (
          <NoData />
        )}
      </div>

      <AddEditCategoryModal
        modalState={categoryModal}
        data={updateCategory}
        setData={setUpdateCategory}
      />

      <DeleteModal
        state={deleteCategory}
        Icon={Apple}
        name="Food"
        title={deleteCategory?.data?.name}
        onClose={() => setDeleteCategory({ open: false, data: null })}
        onSucess={() => onCategoryItem(deleteCategory.data.category_id)}
        isLoading={deleteCategoryMutation.isPending}
      />
    </>
  );
}

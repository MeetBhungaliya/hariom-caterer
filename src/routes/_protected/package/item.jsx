import { getPackageItemList } from "@/api/query-option";
import { IconButton } from "@/components/common/btn-with-icon";
import { ControlledInput } from "@/components/common/controlled-input";
import NoData from "@/components/common/NoData";
import { Table } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { METHODS } from "@/constants/common";
import { DELETE_PACKAGE_ITEM } from "@/constants/endpoints";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api";
import { asyncResponseToaster } from "@/lib/toasts";
import DeleteModal from "@/modals/delete";
import { AddEditPackageItem } from "@/modals/package-item";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Edit, PackagePlus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";

export const Route = createFileRoute("/_protected/package/item")({
  component: RouteComponent,
});

function RouteComponent() {
  const [updatePackageItem, setUpdatePackageItem] = useState();

  const searchForm = useForm();

  const isLoading = useAuthStore((state) => state.isLoading);
  const { page, limit } = Route.useSearch();
  const packageItemModal = useBoolean(false);

  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500);

  const [deleteCategory, setDeletePackageItem] = useState({
    open: false,
    data: null,
  });

  const packageItemList = useQuery(
    getPackageItemList({ page, limit, search: debouncedSearchedValue })
  );

  const deletePackageItemMutation = useMutation({
    mutationFn: async (pim_id) =>
      fetchApi({
        url: `${DELETE_PACKAGE_ITEM}?pim_id=${pim_id}`,
        method: METHODS.DELETE,
      }),
  });

  const onPackageItem = async (pim_id) => {
    const result = await asyncResponseToaster(() =>
      deletePackageItemMutation.mutateAsync(pim_id)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      packageItemList.refetch();
      setDeletePackageItem((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setDeletePackageItem((prev) => ({ ...prev, data: null }));
      }, 150);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Package Item Id",
        accessorKey: "pim_id",
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
                setUpdatePackageItem({
                  name: props.row.original.name,
                  pim_id: props.row.original.pim_id,
                  categories: props.row.original.category,
                });
                packageItemModal.setTrue();
              }}
            >
              <Edit className="size-3.5 md:size-4" />
            </Button>
            <Button
              onClick={() =>
                setDeletePackageItem({
                  open: true,
                  data: {
                    name: props.row.original.name,
                    pim_id: props.row.original.pim_id,
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
    []
  );

  if (packageItemList.isError) return null;

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
            icon={<PackagePlus className="size-5" />}
            label="Add Package Item"
            onClick={packageItemModal.setTrue}
          />
        </div>
        {packageItemList.data.result.list.length ||
        isLoading ||
        packageItemList.fetchStatus === "fetching" ? (
          <Table
            columns={columns}
            data={packageItemList.data.result.list}
            isLoading={isLoading || packageItemList.fetchStatus === "fetching"}
            totalRecords={packageItemList.data.result.totalRecords}
          />
        ) : (
          <NoData />
        )}
      </div>

      <AddEditPackageItem
        modalState={packageItemModal}
        data={updatePackageItem}
        setData={setUpdatePackageItem}
      />

      <DeleteModal
        state={deleteCategory}
        Icon={PackagePlus}
        name="Food"
        title={deleteCategory?.data?.name}
        onClose={() => setDeletePackageItem({ open: false, data: null })}
        onSucess={() => onPackageItem(deleteCategory.data.pim_id)}
        isLoading={deletePackageItemMutation.isPending}
      />
    </>
  );
}

import { getCrockeryList } from "@/api/query-option";
import { IconButton } from "@/components/common/btn-with-icon";
import { ControlledInput } from "@/components/common/controlled-input";
import NoData from "@/components/common/NoData";
import { Table } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { METHODS } from "@/constants/common";
import { DELETE_CROCKERY } from "@/constants/endpoints";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api";
import { paginationSchema } from "@/lib/schema/common";
import { asyncResponseToaster } from "@/lib/toasts";
import AddEditCrockery from "@/modals/crockery";
import DeleteModal from "@/modals/delete";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Edit, Search, Trash2, UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";

export const Route = createFileRoute("/_protected/crockery")({
  component: RouteComponent,
  validateSearch: (search) => paginationSchema.parse(search),
});

function RouteComponent() {
  const [updateCrockery, setUpdateCrockery] = useState();

  const { page, limit } = Route.useSearch();
  const crockeryModal = useBoolean(false);

  const [deleteCrockery, setDeleteCrockery] = useState({
    open: false,
    data: null,
  });

  const isLoading = useAuthStore((state) => state.isLoading);
  const searchForm = useForm();
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500);

  const crockeryList = useQuery(
    getCrockeryList({ page, limit, search: debouncedSearchedValue })
  );

  const deleteCrockeryMutation = useMutation({
    mutationFn: async (crockery_id) =>
      fetchApi({
        url: `${DELETE_CROCKERY}?crockery_id=${crockery_id}`,
        method: METHODS.DELETE,
      }),
  });

  const onDeleteItem = async (crockery_id) => {
    const result = await asyncResponseToaster(() =>
      deleteCrockeryMutation.mutateAsync(crockery_id)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      crockeryList.refetch();
      setDeleteCrockery((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setDeleteCrockery((prev) => ({ ...prev, data: null }));
      }, 150);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Crockery Id",
        accessorKey: "crockery_id",
        size: 200,
      },
      {
        header: "Name",
        accessorKey: "name",
        size: 200,
      },
      {
        header: "Name Hindi",
        accessorKey: "name_hi",
        size: 200,
      },
      {
        header: "Person",
        accessorKey: "person",
        size: 200,
      },
      {
        header: "Quantity",
        accessorKey: "quantity",
        size: 200,
      },
      {
        id: "actions",
        cell: (props) => (
          <div className="flex gap-x-2 md:gap-x-4 justify-end">
            <Button
              onClick={() => {
                setUpdateCrockery({
                  name: props.row.original.name,
                  name_hi: props.row.original.name_hi,
                  person: props.row.original.person,
                  quantity: props.row.original.quantity,
                  crockery_id: props.row.original.crockery_id,
                });
                crockeryModal.setTrue();
              }}
            >
              <Edit className="size-3.5 md:size-4" />
            </Button>
            <Button
              onClick={() =>
                setDeleteCrockery({
                  open: true,
                  data: {
                    name: props.row.original.name,
                    name_hi: props.row.original.name_hi,
                    crockery_id: props.row.original.crockery_id,
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

  if (crockeryList.isError) return null;

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
            icon={<UtensilsCrossed className="size-5" />}
            label="Add Crockery"
            onClick={crockeryModal.setTrue}
          />
        </div>
        {crockeryList.data.result.list.length ||
        isLoading ||
        crockeryList.fetchStatus === "fetching" ? (
          <Table
            columns={columns}
            data={crockeryList.data.result.list}
            isLoading={isLoading || crockeryList.fetchStatus === "fetching"}
            totalRecords={crockeryList.data.result.totalRecords}
          />
        ) : (
          <NoData />
        )}
      </div>

      <AddEditCrockery
        modalState={crockeryModal}
        data={updateCrockery}
        setData={setUpdateCrockery}
      />

      <DeleteModal
        state={deleteCrockery}
        Icon={UtensilsCrossed}
        name="Crockery"
        title={`${deleteCrockery?.data?.name}(${deleteCrockery?.data?.name_hi})`}
        onClose={() => setDeleteCrockery({ open: false, data: null })}
        onSucess={() => onDeleteItem(deleteCrockery.data.crockery_id)}
        isLoading={deleteCrockeryMutation.isPending}
      />
    </>
  );
}

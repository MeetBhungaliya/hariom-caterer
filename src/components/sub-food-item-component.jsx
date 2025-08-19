import { getItemsBySubcategory } from "@/api/query-option";
import { useAuthStore } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Table } from "./common/table";
import { Button } from "./ui/button";
import DeleteModal from "@/modals/delete";
import { ClipboardList, Trash2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { DELETE_ITEM } from "@/constants/endpoints";
import { METHODS } from "@/constants/common";
import { asyncResponseToaster } from "@/lib/toasts";

function SubComponent({ row }) {
  const items = useQuery(
    getItemsBySubcategory({ scm_id: row.original.scm_id })
  );

  const isLoading = useAuthStore((state) => state.isLoading);

  const [deleteItem, setDeleteItem] = useState({
    open: false,
    data: null,
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (item_id) =>
      fetchApi({
        url: `${DELETE_ITEM}?item_id=${item_id}`,
        method: METHODS.DELETE,
      }),
  });

  const onDeleteItem = async (item_id) => {
    const result = await asyncResponseToaster(() =>
      deleteItemMutation.mutateAsync(item_id)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      items.refetch();
      setDeleteItem((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setDeleteItem((prev) => ({ ...prev, data: null }));
      }, 150);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Item Id",
        accessorKey: "item_id",
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
        header: "Price",
        accessorKey: "price",
        size: 200,
      },
      {
        id: "actions",
        cell: (props) => (
          <div className="flex gap-x-2 md:gap-x-4 justify-end">
            <Button
              onClick={() =>
                setDeleteItem({
                  open: true,
                  data: {
                    name: props.row.original.name,
                    item_id: props.row.original.item_id,
                  },
                })
              }
            >
              <Trash2 className="size-3.5 md:size-4" />
            </Button>
          </div>
        ),
        size: 160,
      },
    ],
    []
  );

  return (
    <>
      <Table
        columns={columns}
        data={items.data.result.list}
        isLoading={isLoading || items.fetchStatus === "fetching"}
        pagination={false}
        expandableRows={true}
        SubComponent={SubComponent}
        isSubTable={true}
      />

      <DeleteModal
        state={deleteItem}
        Icon={ClipboardList}
        name="Item"
        title={deleteItem?.data?.name}
        onClose={() => setDeleteItem({ open: false, data: null })}
        onSucess={() => onDeleteItem(deleteItem.data.item_id)}
        isLoading={deleteItem.isPending}
      />
    </>
  );
}

export { SubComponent };

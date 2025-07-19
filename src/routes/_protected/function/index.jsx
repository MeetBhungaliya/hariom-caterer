import { getFunctionsList } from "@/api/query-option";
import { IconButton } from "@/components/common/btn-with-icon";
import { ControlledInput } from "@/components/common/controlled-input";
import { Table } from "@/components/common/table";
import { SubComponent } from "@/components/sub-function-component";
import { Button } from "@/components/ui/button";
import { METHODS } from "@/constants/common";
import { DELETE_FUNCTION, PRINT_FUNCTION } from "@/constants/endpoints";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api";
import { paginationSchema } from "@/lib/schema/common";
import { asyncResponseToaster } from "@/lib/toasts";
import { cn, printPDF } from "@/lib/utils";
import DeleteModal from "@/modals/delete";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Boxes, CornerUpRight, Edit, Search, Trash2 } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Route as AddFunctionRoute } from "./add";
import { Route as EditRoute } from "./edit";
import NoData from "@/components/common/NoData";

export const Route = createFileRoute("/_protected/function/")({
  component: RouteComponent,
  validateSearch: (search) => paginationSchema.parse(search),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { page, limit } = Route.useSearch();

  const [deleteFunction, setDeleteFunction] = useState({
    open: false,
    data: null,
  });

  const isLoading = useAuthStore((state) => state.isLoading);

  const searchForm = useForm();
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500);

  const funtionsList = useQuery(
    getFunctionsList({ page, limit, search: debouncedSearchedValue })
  );

  const printFunctionMutation = useMutation({
    mutationFn: async (function_id) =>
      fetchApi({ url: `${PRINT_FUNCTION}?function_id=${function_id}` }),
  });

  const deleteFunctionMutation = useMutation({
    mutationFn: async (function_id) =>
      fetchApi({
        url: `${DELETE_FUNCTION}?function_id=${function_id}`,
        method: METHODS.DELETE,
      }),
  });

  const onDeleteItem = async (function_id) => {
    const result = await asyncResponseToaster(() =>
      deleteFunctionMutation.mutateAsync(function_id)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      funtionsList.refetch();
      setDeleteFunction((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setDeleteFunction((prev) => ({ ...prev, data: null }));
      }, 150);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "view-functions",
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
        header: "Function Id",
        accessorKey: "function_id",
        size: 200,
      },
      {
        header: "Client Name",
        accessorKey: "client.name",
        size: 200,
      },
      {
        header: "Start/End Date",
        accessorKey: "date",
        cell: (props) => {
          const sortedDates = props.row.original.function_detail
            .map((d) => d.date)
            .slice()
            .sort((a, b) => new Date(a) - new Date(b));
          return (
            <span>
              {moment(sortedDates.at(0)).format("DD-MM-YYYY")}
              &nbsp;/&nbsp;
              {moment(sortedDates.at(-1)).format("DD-MM-YYYY")}
            </span>
          );
        },
        size: 200,
      },
      {
        header: "Venue",
        accessorKey: "venue",
        size: 200,
      },
      {
        header: "Total Amount",
        accessorKey: "total_amount",
        size: 200,
      },
      {
        id: "actions",
        cell: (props) => (
          <div className="flex gap-x-2 md:gap-x-4 justify-end">
            <Button
              className="py-1.5 text-xs md:text-sm"
              onClick={async () => {
                const res = await printFunctionMutation.mutateAsync(
                  props.row.original.function_id
                );
                printPDF(res.result.pdf_url);
              }}
            >
              Print Function
            </Button>
            <Button
              onClick={() =>
                navigate({ to: EditRoute.fullPath, state: props.row.original })
              }
            >
              <Edit className="size-3.5 md:size-4" />
            </Button>
            <Button
              onClick={() =>
                setDeleteFunction({
                  open: true,
                  data: {
                    client_name: props.row.original.client.name,
                    function_id: props.row.original.function_id,
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

  if (funtionsList.isError) return null;

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
            icon={<Boxes className="size-5" />}
            label="Add Function"
            onClick={() => navigate({ to: AddFunctionRoute.fullPath })}
          />
        </div>

        {funtionsList.data.result.list.length ||
        isLoading ||
        funtionsList.fetchStatus === "fetching" ? (
          <Table
            columns={columns}
            data={funtionsList.data.result.list}
            isLoading={isLoading || funtionsList.fetchStatus === "fetching"}
            totalRecords={funtionsList.data.result.totalRecords}
            expandableRows={true}
            SubComponent={SubComponent}
          />
        ) : (
          <NoData />
        )}
      </div>

      <DeleteModal
        state={deleteFunction}
        Icon={Boxes}
        name="Function"
        title={`${deleteFunction?.data?.client_name}'s Function`}
        onClose={() => setDeleteFunction({ open: false, data: null })}
        onSucess={() => onDeleteItem(deleteFunction.data.function_id)}
        isLoading={deleteFunctionMutation.isPending}
      />
    </>
  );
}

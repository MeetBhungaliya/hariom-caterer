import { getEmployeeList } from "@/api/query-option";
import { IconButton } from "@/components/common/btn-with-icon";
import { ControlledInput } from "@/components/common/controlled-input";
import { Table } from "@/components/common/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/use-auth";
import { AddEditEmployee } from "@/modals/emplyoee";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Edit, NotebookText, Search } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";

export const Route = createFileRoute("/_protected/attendance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { page, limit } = Route.useSearch();

  const isLoading = useAuthStore((state) => state.isLoading);

  const searchForm = useForm();
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500);

  const employeeModal = useBoolean(false);
  const [addEditEmployee, setAddEditEmployee] = useState();

  const employeeList = useQuery(
    getEmployeeList({ page, limit, search: debouncedSearchedValue })
  );

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        size: 200,
      },
      {
        header: "Rate",
        accessorKey: "rate",
        size: 200,
      },
      {
        id: "actions",
        cell: (props) => (
          <Button
            onClick={() => {
              setAddEditEmployee({
                emp_id: props.row.original.emp_id,
                name: props.row.original.name,
                phone: props.row.original.phone,
                rate: props.row.original.rate,
                status: props.row.original.status,
              });
              employeeModal.setTrue();
            }}
          >
            <Edit className="size-3.5 md:size-4" />
          </Button>
        ),
        size: 62,
      },
    ],
    []
  );

  if (employeeList.isError) return null;

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
          <div className="flex items-center gap-x-2">
            <Link
              to="employee"
              search={{ date: moment().format("YYYY-M-D") }}
              className={buttonVariants()}
            >
              <CalendarDays />
            </Link>
            <IconButton
              icon={<NotebookText className="size-5" />}
              label="Add Staff"
              onClick={employeeModal.setTrue}
            />
          </div>
        </div>

        {employeeList.data.result.list.length ||
        isLoading ||
        employeeList.fetchStatus === "fetching" ? (
          <Table
            columns={columns}
            data={employeeList.data.result.list}
            isLoading={isLoading || employeeList.fetchStatus === "fetching"}
            totalRecords={employeeList.data.result.totalRecords}
          />
        ) : (
          <NoData />
        )}
      </div>

      <AddEditEmployee
        modalState={employeeModal}
        data={addEditEmployee}
        setData={setAddEditEmployee}
      />
    </>
  );
}

import { getMonthWiseShiftsList } from "@/api/query-option";
import { IconButton } from "@/components/common/btn-with-icon";
import { ControlledInput } from "@/components/common/controlled-input";
import { Table } from "@/components/common/table";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS, SALARY_TYPE, YEARS } from "@/constants/common";
import { useAuthStore } from "@/hooks/use-auth";
import AddSalary from "@/modals/add-salary";
import DeleteModal from "@/modals/delete";
import { AddEditEmployee } from "@/modals/emplyoee";
import { SalaryTransaction } from "@/modals/salary-transactions";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Edit, NotebookText, Search, Trash2 } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";
import { useBoolean, useDebounceValue } from "usehooks-ts";

export const Route = createFileRoute("/_protected/attendance/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { page, limit, month, year } = Route.useSearch();
  const navigate = Route.useNavigate();

  const isLoading = useAuthStore((state) => state.isLoading);

  const searchForm = useForm();
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500);

  const employeeModal = useBoolean(false);
  const [addEditEmployee, setAddEditEmployee] = useState();

  const addSalaryModal = useBoolean(false);
  const [addSalary, setAddSalary] = useState();

  const [deleteEmployee, setDeleteEmployee] = useState({
    open: false,
    data: null,
  });

  const transactionsModal = useBoolean(false);
  const [transaction, setTransaction] = useState();

  const employeeList = useQuery(
    getMonthWiseShiftsList({
      page,
      limit,
      month: month + 1,
      year,
      search: debouncedSearchedValue,
    })
  );

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        size: 160,
      },
      {
        header: "Rate",
        accessorKey: "rate",
        size: 160,
      },
      {
        header: "Total Shift",
        accessorKey: "total_shifts",
        size: 160,
      },
      {
        header: "Paid",
        accessorKey: "paid_amount",
        cell: (props) => {
          return (
            <button
              type="button"
              onClick={() => {
                setTransaction(props.row.original.emp_id);
                transactionsModal.setTrue();
              }}
              className="px-4 text-sm cursor-pointer"
            >
              {props.row.original.paid_amount}
            </button>
          );
        },
        size: 160,
      },
      {
        header: "Salary",
        accessorKey: "calculated_salary",
        size: 160,
      },
      {
        header: "O/S Salary",
        id: "outstaing_salary",
        cell: (props) =>
          props.row.original.calculated_salary - props.row.original.paid_amount,
        size: 160,
      },
      {
        header: "Payout",
        id: "payout",
        cell: (props) => {
          return (
            <Button
              type="button"
              onClick={() => {
                setAddSalary({
                  type: SALARY_TYPE.at(0).value,
                  emp_id: props.row.original.emp_id,
                  amount:
                    props.row.original.calculated_salary -
                    props.row.original.paid_amount,
                  date: moment().format("YYYY-MM-DD"),
                });
                addSalaryModal.setTrue();
              }}
              className="px-4 text-sm"
            >
              Payout
            </Button>
          );
        },
        size: 160,
      },
      {
        id: "actions",
        cell: (props) => (
          <div className="flex gap-x-2 md:gap-x-4 justify-end">
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
            <Button
              onClick={() =>
                setDeleteEmployee({
                  open: true,
                  data: {
                    name: props.row.original.name,
                    emp_id: props.row.original.emp_id,
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

  if (employeeList.isError) return null;

  return (
    <>
      <div className="h-full flex flex-col gap-y-3 md:gap-y-6">
        <div className="bg-white p-2 md:p-4 rounded-lg md:rounded-xl flex justify-between gap-2 md:gap-4 flex-col lg:flex-row">
          <div className="w-full lg:max-w-lg flex items-end gap-x-3">
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
            <div className="w-full h-full flex gap-x-2">
              <Select
                value={month}
                onValueChange={(month) => {
                  navigate({ search: { page, limit, month, year } });
                }}
              >
                <SelectTrigger icon className="w-full max-w-[240px] !h-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((item, key) => (
                    <SelectItem key={key} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={year}
                onValueChange={(value) => {
                  navigate({ search: { page, limit, month, year: value } });
                }}
              >
                <SelectTrigger icon className="w-full max-w-[240px] !h-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="h-full max-h-[400px]">
                  {YEARS().map((item, key) => (
                    <SelectItem key={key} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-x-2 justify-end">
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

      <AddSalary
        modalState={addSalaryModal}
        data={addSalary}
        setData={setAddSalary}
      />

      <SalaryTransaction
        modalState={transactionsModal}
        data={transaction}
        setData={setTransaction}
      />

      <DeleteModal
        state={deleteEmployee}
        Icon={NotebookText}
        name="Staff"
        title={deleteEmployee?.data?.name}
        onClose={() => setDeleteEmployee({ open: false, data: null })}
        onSucess={() => onPackageItem(deleteEmployee.data.pim_id)}
        isLoading={false}
      />
    </>
  );
}

import { getEmployeeSalary } from "@/api/query-option";
import { Table } from "@/components/common/table"; // assuming you have this premade
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

function SalaryTransaction({ modalState, data, setData }) {
  const { month, year } = useSearch({ strict: false });

  const employeeSalary = useQuery(
    getEmployeeSalary({
      month,
      year,
      emp_id: data,
      enabled: Boolean(data),
    })
  );

  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        size: 140,
        cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
      },
      {
        header: "Type",
        accessorKey: "type",
        size: 100,
        cell: ({ row }) => (row.original.type === 0 ? "Payout" : "Other"),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        size: 120,
      },
    ],
    []
  );

  function onClose(e) {
    if(!e){
      setTimeout(() => {
        modalState.setFalse();
        setData(null);
      }, 150);
    }
  }

  return (
    <Dialog open={modalState.value} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 bg-bg-1 rounded-t-xl shadow">
          <DialogTitle className="text-center text-lg md:text-xl font-bold">
            Salary Details
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>
              Employee salary and transaction details
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>

        <div className="p-4 md:p-6 flex flex-col gap-y-4 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div className="bg-bg-2 p-3 rounded-xl shadow">
              <p className="font-medium">Calculated Salary</p>
              <p className="text-lg font-bold text-sky-600">
                ₹
                {
                  employeeSalary.data?.result?.salary_calculation
                    ?.calculated_salary
                }
              </p>
            </div>
            <div className="bg-bg-2 p-3 rounded-xl shadow">
              <p className="font-medium">Outstanding Salary</p>
              <p className="text-lg font-bold text-red-600">
                ₹
                {
                  employeeSalary.data?.result?.salary_calculation
                    ?.outstanding_salary
                }
              </p>
            </div>
          </div>
          <div className="h-full max-h-[250px] flex flex-col">
            <h3 className="font-semibold mb-2">Transactions</h3>
            {employeeSalary.data.result.transactions.length ||
            employeeSalary.fetchStatus === "fetching" ? (
              <Table
                columns={columns}
                data={employeeSalary.data?.result?.transactions}
                totalRecords={employeeSalary.data?.result?.transactions?.length}
                isLoading={employeeSalary.isFetching}
                pagination={false}
                className="!p-0"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No transactions found
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { SalaryTransaction };

import { getEmployeeSalary } from '@/api/query-option';
import { ControlledInput } from '@/components/common/controlled-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MONTHS, YEARS } from '@/constants/common';
import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { useDebounceValue } from 'usehooks-ts';
import { useMemo } from 'react';
import { useAuthStore } from '@/hooks/use-auth';
import { Table } from '@/components/common/table';
import NoData from '@/components/common/NoData';

export const Route = createFileRoute(
  '/_protected/attendance/employee/$emp_id'
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { month, year } = Route.useSearch();
  const params = Route.useParams();
  const navigate = useNavigate();

  const isLoading = useAuthStore((state) => state.isLoading);

  const searchForm = useForm();
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500);

  const employeeSalary = useQuery(
    getEmployeeSalary({
      month,
      year,
      emp_id: params['emp_id'],
      search: debouncedSearchedValue,
    })
  );

  const data = employeeSalary.data?.result;

  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        size: 200,
      },
      {
        header: "Amount",
        accessorKey: "amount",
        size: 200,
      },
    ],
    []
  );

  return (
    <div className="h-full flex flex-col gap-y-3 md:gap-y-6">
      <div className="bg-white p-2 md:p-4 rounded-lg md:rounded-xl flex justify-between gap-2 md:gap-4 flex-col md:flex-row">
        <div className="flex items-end gap-x-3">
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
              onValueChange={(value) => {
                navigate({ search: { month: value, year } });
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
                navigate({ search: { month, year: value } });
              }}
            >
              <SelectTrigger icon className="w-full max-w-[240px] !h-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS().map((item, key) => (
                  <SelectItem key={key} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {employeeSalary.isFetching ? (
          <Skeleton className="w-full max-w-[200px] h-10" />
        ) : (
          data && (
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex gap-x-2 items-center">
                <p className="font-medium text-gray-500">Employee Name:</p>
                <strong>{data.employee.name}</strong>
              </div>
              <div className="flex gap-x-2 items-center">
                <p className="font-medium text-gray-500">Salary Rate:</p>
                <strong>{data.employee.rate}</strong>
              </div>
            </div>
          )
        )}
      </div>
      {employeeSalary.isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="w-full h-[317px]" />
          <Skeleton className="w-full h-[317px]" />
        </div>
      ) : (
        data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Attendance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <p className="text-gray-600">Total Shifts:</p>
                  <p className="font-medium">{data.attendance.total_shifts}</p>

                  <p className="text-gray-600">Morning Shifts:</p>
                  <p className="font-medium">
                    {data.attendance.morning_shifts}
                  </p>

                  <p className="text-gray-600">Evening Shifts:</p>
                  <p className="font-medium">
                    {data.attendance.evening_shifts}
                  </p>

                  <p className="text-gray-600">Days Present:</p>
                  <p className="font-medium">{data.attendance.days_present}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Salary Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <p className="text-gray-600">Calculated Salary:</p>
                  <p className="font-medium">
                    {data.salary_calculation.calculated_salary}
                  </p>

                  <p className="text-gray-600">Advance:</p>
                  <p className="font-medium">
                    {data.salary_calculation.advance_total}
                  </p>

                  <p className="text-gray-600">Payout:</p>
                  <p className="font-medium">
                    {data.salary_calculation.payout_total}
                  </p>

                  <p className="text-gray-600">Bonus:</p>
                  <p className="font-medium">
                    {data.salary_calculation.bonus_total}
                  </p>

                  <p className="text-gray-600">Deduction:</p>
                  <p className="font-medium">
                    {data.salary_calculation.deduction_total}
                  </p>

                  <Separator className="col-span-2 my-2" />

                  <p className="text-gray-600">Outstanding:</p>
                  <p className="font-semibold text-green-600">
                    {data.salary_calculation.outstanding_salary}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )}
      {data.transactions.length ||
      isLoading ||
      employeeSalary.fetchStatus === "fetching" ? (
        <Table
          columns={columns}
          data={data.transactions}
          isLoading={isLoading || employeeSalary.fetchStatus === "fetching"}
          pagination={false}
        />
      ) : (
        <NoData />
      )}
    </div>
  );
}

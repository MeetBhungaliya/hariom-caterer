import {
  getAllEmployeeList,
  getAttendanceList,
  getEmployeeList,
  getMonthWiseShiftsList,
} from "@/api/query-option";
import { ControlledInput } from "@/components/common/controlled-input";
import NoData from "@/components/common/NoData";
import { Table } from "@/components/common/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { METHODS } from "@/constants/common";
import { ADD_ATTENDANCE, GET_MONTH_WISE_SHIFTS } from "@/constants/endpoints";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api";
import { asyncResponseToaster } from "@/lib/toasts";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Search } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export const Route = createFileRoute("/_protected/attendance/employee/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { date } = Route.useSearch();

  const isLoading = useAuthStore((state) => state.isLoading);

  const searchForm = useForm();
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500);

  const [attendance, setAttendance] = useState({ date, attendances: [] });

  const employeeList = useQuery(
    getAllEmployeeList({ search: debouncedSearchedValue })
  );

  const attendanceList = useQuery(
    getAttendanceList({
      start_date: date,
      end_date: date,
    })
  );

  const insertAttendanceMutation = useMutation({
    mutationFn: async (data) =>
      fetchApi({ url: ADD_ATTENDANCE, method: METHODS.POST, data }),
  });

  useEffect(() => {
    if (employeeList.isFetching || attendanceList.isFetching) return;

    const attendances = attendanceList.data.result.list;

    const employeeWithAttendance = employeeList.data.result.list.map((data) => {
      const preAttendance = attendances.find((d) => d.emp_id === data.emp_id);

      if (!preAttendance || !preAttendance?.attendance?.length)
        return {
          emp_id: data.emp_id,
          morning: false,
          evening: false,
        };

      return {
        emp_id: data.emp_id,
        morning: Boolean(preAttendance.attendance.at(0)["morning"]),
        evening: Boolean(preAttendance.attendance.at(0)["evening"]),
      };
    });

    setAttendance((prev) => ({
      ...prev,
      attendances: employeeWithAttendance,
    }));
  }, [employeeList.isFetching, attendanceList.isFetching]);

  const updateAttendance = (emp_id, isPresent, shift) => {
    setAttendance((prev) => ({
      ...prev,
      attendances: prev.attendances.map((data) =>
        data.emp_id === emp_id ? { ...data, [shift]: isPresent } : data
      ),
    }));
  };

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        size: 200,
      },
      {
        header: "Morning",
        id: "morning",
        cell: (props) => (
          <Checkbox
            checked={
              attendance.attendances.find(
                (data) => props.row.original.emp_id === data.emp_id
              )?.["morning"]
            }
            onCheckedChange={(e) =>
              updateAttendance(props.row.original.emp_id, e, "morning")
            }
            className="size-5"
          />
        ),
        size: 200,
      },
      {
        header: "Evening",
        id: "evening",
        cell: (props) => (
          <Checkbox
            checked={
              attendance.attendances.find(
                (data) => props.row.original.emp_id === data.emp_id
              )?.["evening"]
            }
            onCheckedChange={(e) =>
              updateAttendance(props.row.original.emp_id, e, "evening")
            }
            className="size-5"
          />
        ),
        size: 200,
      },
    ],
    [
      employeeList.isFetching,
      attendanceList.isFetching,
      attendance.date,
      JSON.stringify(attendance.attendances),
    ]
  );

  if (employeeList.isError) return null;
  
  return (
    <>
      <div className="h-full flex flex-col gap-y-3 md:gap-y-6">
        <div className="bg-white p-2 md:p-4 rounded-lg md:rounded-xl flex justify-between gap-2 md:gap-4">
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
            <div className="flex gap-x-2">
              <Link
                search={{
                  date: moment().subtract(1, "days").format("YYYY-M-D"),
                }}
                className={cn(
                  buttonVariants({
                    className: cn(
                      "text-sm",
                      date === moment().subtract(1, "days").format("YYYY-M-D")
                        ? "text-white bg-sky-600 border-sky-600"
                        : ""
                    ),
                  })
                )}
              >
                {new Date().getDate() - 1} - Yesterday
              </Link>
              <Link
                search={{ date: moment().format("YYYY-M-D") }}
                className={cn(
                  buttonVariants({
                    className: cn(
                      "text-sm",
                      date === moment().format("YYYY-M-D")
                        ? "text-white bg-sky-600 border-sky-600"
                        : ""
                    ),
                  })
                )}
              >
                {new Date().getDate()} - Today
              </Link>
            </div>
          </div>
          <Button
            className="px-6"
            onClick={async () => {
              const result = await asyncResponseToaster(() =>
                insertAttendanceMutation.mutateAsync(attendance)
              );
              if (
                result.success &&
                result.value &&
                result.value.ResponseCode === 1
              ) {
                employeeList.refetch();
                attendanceList.refetch();
                queryClient.invalidateQueries({
                  queryKey: [GET_MONTH_WISE_SHIFTS],
                });
              }
            }}
          >
            Save
          </Button>
        </div>

        {employeeList.data.result.list.length ||
        attendanceList.data.result.list.length ||
        isLoading ||
        employeeList.fetchStatus === "fetching" ||
        attendanceList.fetchStatus === "fetching" ? (
          <Table
            columns={columns}
            data={employeeList.data.result.list}
            isLoading={isLoading || employeeList.fetchStatus === "fetching"}
            totalRecords={employeeList.data.result.totalRecords}
            pagination={false}
          />
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}

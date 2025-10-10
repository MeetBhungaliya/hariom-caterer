import {
  getAllEmployeeList,
  getAttendanceList
} from "@/api/query-option";
import { ControlledInput } from "@/components/common/controlled-input";
import NoData from "@/components/common/NoData";
import { Table } from "@/components/common/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { METHODS } from "@/constants/common";
import { ADD_ATTENDANCE, GET_MONTH_WISE_SHIFTS } from "@/constants/endpoints";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api";
import { asyncResponseToaster } from "@/lib/toasts";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDaysIcon, Search } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export const Route = createFileRoute("/_protected/attendance/employee/")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const { date } = Route.useSearch();
  const navigate = Route.useNavigate();

  const isLoading = useAuthStore((state) => state.isLoading);

  const searchForm = useForm();
  const [debouncedSearchedValue, setValue] = useDebounceValue(null, 500);

  const [attendance, setAttendance] = useState({ date, attendances: [] });
  const [isDateSelector, setIsDateSelector] = useState(false)

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
  }, [employeeList.isFetching, attendanceList.isFetching, date]);

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
          <div className="mx-5 py-2 flex items-center">
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
          </div>
        ),
        size: 200,
      },
      {
        header: "Evening",
        id: "evening",
        cell: (props) => (
          <div className="mx-5 py-2 flex items-center">
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
          </div>
        ),
        size: 200,
      },
    ],
    [
      employeeList.isFetching,
      attendanceList.isFetching,
      attendance.date,
      JSON.stringify(attendance.attendances),
      date,
    ]
  );

  if (employeeList.isError) return null;
  
  return (
    <>
      <div className="h-full flex flex-col gap-y-3 md:gap-y-6">
        <div className="bg-white p-2 md:p-4 rounded-lg md:rounded-xl flex justify-between gap-2 md:gap-4 flex-col sm:flex-row">
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
              <Popover open={isDateSelector} onOpenChange={setIsDateSelector}>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      "w-fit justify-center px-3 sm:py-2.5 text-left font-normal text-base",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarDaysIcon className="size-5" />
                    {date ? (
                      moment(date).format("DD-MM-YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(date)}
                    disabled={(date) => date > new Date()}
                    onSelect={(date) => {
                      navigate({
                        search: { date: moment(date).format("YYYY-M-D") },
                      });
                      setIsDateSelector(false);
                    }}
                    initialFocus
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button
            className="w-full max-w-[100px] ml-auto px-6"
            onClick={async () => {
              const result = await asyncResponseToaster(() =>
                insertAttendanceMutation.mutateAsync({ ...attendance, date })
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

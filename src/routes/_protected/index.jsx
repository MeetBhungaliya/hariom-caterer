import { getDashboard } from "@/api/query-option";
import NoData from "@/components/common/NoData";
import { Table } from "@/components/common/table";
import { useAuthStore } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookMarked, ClipboardList } from "lucide-react";
import moment from "moment";
import { useMemo } from "react";

export const Route = createFileRoute("/_protected/")({
  component: RouteComponent,
});

function RouteComponent() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const dashboardData = useQuery(getDashboard());

  const columns = useMemo(
    () => [
      {
        header: "Order Id",
        accessorKey: "order_id",
        size: 200,
      },
      {
        header: "Client Name",
        accessorKey: "client.name",
        size: 200,
      },
      {
        header: "Date & Time",
        accessorKey: "date",
        cell: (props) => (
          <span>
            {moment(props.getValue()).format("DD-MM-YYYY")}
            &nbsp;/&nbsp;
            {props.row.original.time}
          </span>
        ),
        size: 200,
      },
      {
        header: "Person",
        accessorKey: "person",
        size: 200,
      },
      {
        header: "Venue",
        accessorKey: "venue",
        size: 200,
      },
      {
        header: "Jain Counter",
        accessorKey: "jain_counter",
        size: 200,
      },
      {
        header: "Per Plate Cost",
        accessorKey: "per_plate_cost",
        size: 200,
      },
      {
        header: "Selling Price",
        accessorKey: "selling_price",
        size: 200,
      },
      {
        header: "Pro",
        accessorKey: "pro",
        size: 200,
      },
      {
        header: "Bom Boys",
        accessorKey: "bom_boys",
        size: 200,
      },
      {
        header: "Packed Bottle",
        accessorKey: "packed_bottle",
        size: 200,
      },
    ],
    []
  );

  if (dashboardData.isError) return null;

  return (
    <div className="h-full flex flex-col gap-y-6">
      <div className="grid grid-cols-4 gap-x-6">
        <div className="p-4 bg-white rounded-xl">
          <div className="w-max p-2.5 rounded-full bg-[#F9A82633]">
            <BookMarked className="size-6 text-[#F9A826]" />
          </div>
          <div className="mt-4 pl-1">
            <p className="text-gray-500">Today's Order</p>
            {dashboardData.isFetching ? (
              <p className="h-8 bg-gray-200 animate-pulse rounded-sm" />
            ) : (
              <p className="text-2xl font-medium">
                {dashboardData.data.result.order.length}
              </p>
            )}
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl">
          <div className="w-max p-2.5 rounded-full bg-[#7486C333]">
            <ClipboardList className="size-6 text-[#7486C3]" />
          </div>
          <div className="mt-4 pl-1">
            <p className="text-gray-500">Total Items</p>
            {dashboardData.isFetching ? (
              <p className="h-8 bg-gray-200 animate-pulse rounded-sm" />
            ) : (
              <p className="text-2xl font-medium">
                {dashboardData.data.result.total_items}
              </p>
            )}
          </div>
        </div>
      </div>
      {dashboardData.data.result.order?.length ||
      isLoading ||
      dashboardData.fetchStatus === "fetching" ? (
        <Table
          columns={columns}
          data={dashboardData.data.result.order}
          isLoading={isLoading || dashboardData.fetchStatus === "fetching"}
          pagination={false}
        />
      ) : (
        <NoData />
      )}
    </div>
  );
}

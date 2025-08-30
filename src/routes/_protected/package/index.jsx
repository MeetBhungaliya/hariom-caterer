import { getPackagesList } from "@/api/query-option";
import { IconButton } from "@/components/common/btn-with-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { METHODS, pagination } from "@/constants/common";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Boxes, ChevronRight, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Route as EditPackageRoute } from "./$package_id";
import { Route as AddPackageRoute } from "./add";
import { Route as ItemRoute } from "./item";
import DeleteModal from "@/modals/delete";
import { fetchApi } from "@/lib/api";
import { DELETE_PACKAGE } from "@/constants/endpoints";
import { asyncResponseToaster } from "@/lib/toasts";

export const Route = createFileRoute("/_protected/package/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const [deletePackage, setDeletePackage] = useState({
    open: false,
    data: null,
  });

  const packageList = useQuery(getPackagesList());

  const deletePackageMutation = useMutation({
    mutationFn: async (package_id) =>
      fetchApi({
        url: `${DELETE_PACKAGE}?package_id=${package_id}`,
        method: METHODS.DELETE,
      }),
  });

  const onDeletePackage = async (package_id) => {
    const result = await asyncResponseToaster(() =>
      deletePackageMutation.mutateAsync(package_id)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      packageList.refetch();
      setDeletePackage((prev) => ({ ...prev, open: false }));
      setTimeout(() => {
        setDeletePackage((prev) => ({ ...prev, data: null }));
      }, 150);
    }
  };

  if (packageList.isError) return null;

  return (
    <>
      <div className="h-full flex flex-col gap-y-2 md:gap-y-4 overflow-hidden">
        <div className="bg-white p-4 rounded-xl flex gap-x-4 justify-end">
          <IconButton
            icon={<Boxes className="size-5" />}
            label="Add Package"
            onClick={() => navigate({ to: AddPackageRoute.fullPath })}
          />
          <IconButton
            iconEnd={true}
            icon={<ChevronRight className="size-5" />}
            label="View Package Item"
            onClick={() =>
              navigate({ to: ItemRoute.fullPath, search: pagination })
            }
          />
        </div>
        <ScrollArea className="overflow-hidden">
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 360: 2, 640: 3, 900: 3, 1200: 4 }}
          >
            <Masonry>
              {packageList.data.result.list.map((data) => {
                return (
                  <Card
                    key={data.package_id}
                    className="w-full max-w-md h-max my-1 py-0 gap-y-0"
                  >
                    <CardHeader className="p-2 md:p-4 flex justify-between items-center rounded-t-lg md:rounded-t-xl bg-sky-600 gap-0">
                      <CardTitle className="text-white text-sm md:text-base">
                        {data.name}
                      </CardTitle>
                      <div className="flex gap-x-2">
                        <Button
                          type="button"
                          className="w-full max-w-7 md:max-w-8 p-1.5 rounded-sm text-white hover:text-text-1 hover:bg-white"
                          onClick={() =>
                            navigate({
                              to: EditPackageRoute.fullPath,
                              params: { package_id: data.package_id },
                              state: data,
                            })
                          }
                        >
                          <Edit className="size-3 md:size-4 text-current" />
                        </Button>
                        <Button
                          type="button"
                          className="w-full max-w-7 md:max-w-8 p-1.5 rounded-sm text-white hover:text-text-1 hover:bg-white"
                          onClick={() =>
                            setDeletePackage({
                              open: true,
                              data: {
                                name: data.name,
                                package_id: data.package_id,
                              },
                            })
                          }
                        >
                          <Trash2 className="size-5" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col justify-center divide-y">
                      {data.package_item.map((item) => {
                        return (
                          <div
                            key={item.ppm_id}
                            className="flex justify-between px-2 md:px-4 py-1 md:py-2"
                          >
                            <span className="w-full text-xs md:text-sm">
                              {item.name}
                            </span>
                            <span className="w-full text-xs md:text-sm max-w-8 text-center">
                              {item.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
        </ScrollArea>
      </div>

      <DeleteModal
        state={deletePackage}
        Icon={Boxes}
        name="Package"
        title={deletePackage?.data?.name}
        onClose={() => setDeletePackage({ open: false, data: null })}
        onSucess={() => onDeletePackage(deletePackage.data.package_id)}
        isLoading={deletePackageMutation.isPending}
      />
    </>
  );
}

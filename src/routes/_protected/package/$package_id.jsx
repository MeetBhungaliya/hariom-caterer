import { getPackagesList } from "@/api/query-option";
import { getPackageItemList } from "@/api/select-options";
import { ControlledCountInput } from "@/components/common/controlled-count-input";
import { ControlledInput } from "@/components/common/controlled-input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { METHODS } from "@/constants/common";
import { UPDATE_PACKAGE } from "@/constants/endpoints";
import { addEditPackageSchema } from "@/lib/schema";
import { asyncResponseToaster } from "@/lib/toasts";
import { cn } from "@/lib/utils";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { PlusCircle, ReceiptIndianRupee, Trash2, UserPen } from "lucide-react";
import { Route as PackageItemRoute } from "./index";
import { fetchApi } from "@/lib/api";

export const Route = createFileRoute("/_protected/package/$package_id")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  const { location } = useRouterState();
  const { package_id } = Route.useParams();

  const { Field, handleSubmit, Subscribe, store, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addEditPackageSchema },
    defaultValues: {
      name: location.state.name,
      price: location.state.price,
      data: location.state.package_item,
    },
  });

  const updatePackageMutation = useMutation({
    mutationFn: async (data) =>
      fetchApi({
        url: `${UPDATE_PACKAGE}?_method=${METHODS.PUT}`,
        method: METHODS.POST,
        data,
      }),
  });

  const itemFields = useStore(store, (state) => state.values.data);

  const packageItemList = useQuery(getPackageItemList());

  async function onSubmit({ value }) {
    const deleted_ppm_ids = [];

    const currentItems = new Set(value.data.map((item) => item.ppm_id));
    const previousItems = Array.from(
      new Set(location.state.package_item.map((item) => item.pim_id))
    );

    location.state.package_item.forEach((item) => {
      if (!item.ppm_id) {
      }
      const isInValue = currentItems.has(item.ppm_id);
      if (!isInValue) deleted_ppm_ids.push(item.ppm_id);
    });

    const filteredData = value.data.filter(
      (item) => !previousItems.includes(item.pim_id)
    );

    const payload = {
      package_id,
      deleted_ppm_ids,
      name: value.name,
      price: value.price,
      data: filteredData,
    };

    const result = await asyncResponseToaster(() =>
      updatePackageMutation.mutateAsync(payload)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getPackagesList);
      onClose();
    }
  }

  function onClose() {
    setTimeout(() => {
      navigate({ to: PackageItemRoute.fullPath });
      reset({ name: undefined, data: [] });
    }, 150);
  }

  return (
    <>
      <div className="h-full flex flex-col gap-y-6 overflow-hidden">
        <div className="bg-white p-4 rounded-xl flex justify-end gap-x-4">
          <Subscribe
            selector={(state) => state.isDirty}
            children={(isDirty) => (
              <Button
                type="button"
                className="w-full max-w-[160px] py-2 text-base bg-sky-600 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit();
                }}
                disabled={!isDirty}
              >
                Update
              </Button>
            )}
          />
        </div>
        <div className="h-full flex flex-col gap-y-6 bg-white rounded-xl overflow-hidden">
          <div className="p-6 pb-0 flex gap-x-3">
            <Field
              name="name"
              children={(field) => (
                <ControlledInput
                  id="name"
                  label="Package name"
                  containerClassName="w-full max-w-xs"
                  field={field}
                  prefix={<UserPen className="size-5" />}
                />
              )}
            />
            <Field
              name="price"
              children={(field) => (
                <ControlledInput
                  type="number"
                  label="Price"
                  field={field}
                  prefix={<ReceiptIndianRupee className="size-5" />}
                  containerClassName="w-full max-w-xs"
                />
              )}
            />
            <Field
              name="data"
              mode="array"
              children={(field) => (
                <Button
                  type="button"
                  className="px-3"
                  onClick={() =>
                    field.pushValue({ pim_id: undefined, quantity: 1 })
                  }
                >
                  <PlusCircle />
                </Button>
              )}
            />
          </div>
          <ScrollArea className="px-3 pb-4 overflow-hidden">
            <div className="w-full px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
              {itemFields.map((item, index) => {
                return (
                  <Subscribe
                    key={index}
                    selector={(state) => state.errors}
                    children={(dataErrors) => {
                      const error = dataErrors.at(0)?.[`data[${index}].pim_id`];
                      return (
                        <div
                          key={index}
                          className={cn(
                            "flex border rounded-lg",
                            error?.length ? "border-red-500" : "border-border-1"
                          )}
                        >
                          <Field
                            key={item.id}
                            name={`data[${index}].pim_id`}
                            children={(subField) => {
                              return (
                                <Select
                                  value={subField.state.value}
                                  onValueChange={(value) =>
                                    subField.handleChange(value)
                                  }
                                >
                                  <SelectTrigger
                                    icon={false}
                                    className="w-full !h-auto border-border-1 gap-x-0 bg-transparent px-2 py-3 focus:ring-0 focus:ring-offset-0 border-none truncate"
                                  >
                                    <SelectValue
                                      placeholder="Select item"
                                      className="text-text-2 text-sm"
                                    />
                                  </SelectTrigger>
                                  <SelectContent
                                    align="middle"
                                    className="min-w-20"
                                  >
                                    {packageItemList.data.result.list.map(
                                      (item, key) => (
                                        <SelectItem
                                          key={key}
                                          value={item.pim_id}
                                        >
                                          {item.name}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              );
                            }}
                          />
                          <Field
                            name={`data[${index}].quantity`}
                            children={(subField) => (
                              <ControlledCountInput
                                min={1}
                                max={99}
                                value={subField.state.value}
                                onChange={(value) =>
                                  subField.handleChange(value)
                                }
                                error={error?.length}
                              />
                            )}
                          />
                          <Field
                            name="data"
                            mode="array"
                            children={(field) => {
                              return (
                                <Button
                                  type="button"
                                  className={cn(
                                    "px-3 border-0 border-l rounded-l-none hover:bg-red-500 hover:border-red-500",
                                    error?.length
                                      ? "border-red-500"
                                      : "border-border-1"
                                  )}
                                  onClick={() => field.removeValue(index)}
                                >
                                  <Trash2 className="size-5" />
                                </Button>
                              );
                            }}
                          />
                        </div>
                      );
                    }}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

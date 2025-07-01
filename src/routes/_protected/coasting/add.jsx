import { getAllPackageOption, getAllPartyOption } from "@/api/select-options";
import { CoastingItem } from "@/components/coasting-item";
import ControlledDatepicker from "@/components/common/controlled-datepicker";
import { ControlledInput } from "@/components/common/controlled-input";
import { ControlledSearchableSelect } from "@/components/common/controlled-searchable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { METHODS, pagination, TIME_OPTIONS } from "@/constants/common";
import { ADD_COASTING, GET_ORDERS } from "@/constants/endpoints";
import { useAuthStore } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api";
import { addEditCoastingSchema } from "@/lib/schema";
import { asyncResponseToaster } from "@/lib/toasts";
import { cn, printPDF } from "@/lib/utils";
import { useForm, useStore } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Calendar,
  EthernetPort,
  IndianRupee,
  MapPinHouse,
  Package,
  Timer,
  UserRound,
  Users,
} from "lucide-react";
import moment from "moment";
import { useCallback, useEffect } from "react";
import { useBoolean } from "usehooks-ts";
import { Route as OrderRoute } from "./index";

export const Route = createFileRoute("/_protected/coasting/add")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const showPrice = useBoolean(true);

  const addCoastingMutation = useMutation({
    mutationFn: async (data) =>
      fetchApi({ url: ADD_COASTING, method: METHODS.POST, data }),
  });

  const {
    Field,
    handleSubmit,
    Subscribe,
    setFieldValue,
    getFieldValue,
    reset,
    store,
  } = useForm({
    onSubmit,
    validators: { onSubmit: addEditCoastingSchema },
  });

  const items = useStore(store, (state) => state.values.item);

  const getTotalCost = useCallback(() => {
    return (items ?? []).reduce((acc, item) => acc + (item.price ?? 0), 0);
  }, [JSON.stringify(items)]);

  useEffect(() => {
    setFieldValue("per_plate_cost", getTotalCost());

    const extraItemTotal = items
      ?.filter((value) => value.name === "Extra Item")
      ?.reduce((acc, curr) => (acc += curr.price ?? 0), 0);

    packagesOption.then((res) => {
      const packageItem = (res.result.list ?? []).find(
        (item) => item.package_id === getFieldValue("package_id")
      );
      setFieldValue("selling_price", (packageItem.price ?? 0) + extraItemTotal);
    });
  }, [JSON.stringify(items)]);

  const isLoading = useAuthStore((state) => state.isLoading);

  const partiesOption = queryClient.ensureQueryData(getAllPartyOption());
  const packagesOption = queryClient.ensureQueryData(getAllPackageOption());

  async function onSubmit({ value }) {
    if (value.package_id === 0.69) {
      value.package_id = null;
    }

    const item = value.item
      .map((item) => ({
        pim_id: item.pim_id ?? null,
        item_id: Number(item.item_id),
      }))
      .filter((item) => item.item_id);

    const payload = {
      ...value,
      item,
      date: moment(value.date).format("YYYY-MM-DD"),
      pro: value.pro ?? 0,
      bom_boys: value.bom_boys ?? 0,
      packed_bottle: value.packed_bottle ?? 0,
    };

    const result = await asyncResponseToaster(() =>
      addCoastingMutation.mutateAsync(payload)
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      printPDF(result.value.result.url);
      queryClient.invalidateQueries({ queryKey: GET_ORDERS });
      onClose();
    }
  }

  function onClose() {
    setTimeout(() => {
      navigate({ to: OrderRoute.fullPath, search: pagination });
      reset();
    }, 150);
  }

  return (
    <div className="h-full flex flex-col gap-y-3 md:gap-y-6 overflow-hidden">
      <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl flex items-center justify-end gap-x-2 md:gap-x-4">
        <Switch
          className="size-auto w-14 md:w-16 h-6 md:h-7 [&>*:first-child]:size-4 md:[&>*:first-child]:size-5 [&>*:first-child]:data-[state=unchecked]:translate-x-1 md:[&>*:first-child]:data-[state=unchecked]:translate-x-1 [&>*:first-child]:data-[state=checked]:translate-x-[35px] md:[&>*:first-child]:data-[state=checked]:translate-x-[38px] data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-sky-600"
          checked={showPrice.value}
          onCheckedChange={showPrice.toggle}
        />
        <Subscribe
          selector={(state) => state.isDirty}
          children={(isDirty) => (
            <Button
              type="button"
              className="w-full max-w-[120px] md:max-w-[160px] py-2 text-sm md:text-base bg-sky-600 text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
              disabled={!isDirty}
            >
              Add
            </Button>
          )}
        />
      </div>
      <div className="h-full p-3 md:p-6 flex flex-col gap-y-3 md:gap-y-6 bg-white rounded-lg md:rounded-xl overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <Field
            name="client_id"
            children={(field) => (
              <ControlledSearchableSelect
                id="client_id"
                label="Select party"
                field={field}
                prefix={<UserRound className="size-5" />}
                options={partiesOption}
                searchPlaceholder="Search party"
                prepareOption={(data) =>
                  data.map((data) => ({
                    value: data.client_id,
                    label: `${data.name} (${data.phone})`,
                  }))
                }
                updateTriggerer={field.state.value || isLoading}
              />
            )}
          />
          <Field
            name="date"
            children={(field) => (
              <ControlledDatepicker
                id="date"
                label="Select date"
                field={field}
                prefix={<Calendar className="size-5" />}
                className="w-max"
                align="start"
              />
            )}
          />
          <Field
            name="time"
            children={(field) => {
              const errorMsg = field.state.meta.errors?.[0]?.message;
              return (
                <Select
                  defaultValue={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger
                    icon
                    className={cn(
                      "py-2.5 px-3 rounded-lg relative cursor-pointer",
                      "w-full !h-full gap-3 text-sm md:text-base justify-start font-medium",
                      errorMsg
                        ? "border-red-500 data-[placeholder]:text-red-500"
                        : "data-[placeholder]:text-gray-500 border-gray-300"
                    )}
                  >
                    <div
                      className={cn(
                        "h-full absolute top-0 left-0 hidden lg:flex",
                        "aspect-square items-center justify-center",
                        "rounded-l-[10px] bg-sky-600 backdrop-blur-sm",
                        "text-white dark:text-white"
                      )}
                    >
                      <Timer />
                    </div>

                    <span
                      className={cn(
                        "truncate text-xs sm:text-sm md:text-base",
                        "lg:ml-[3rem]",
                        errorMsg
                          ? "text-red-500"
                          : field.state.value
                            ? "text-text-1"
                            : "text-gray-500"
                      )}
                    >
                      {field.state.value ?? "Select time"}
                    </span>
                  </SelectTrigger>
                  <SelectContent align="middle" className="min-w-20">
                    {TIME_OPTIONS.map((item, key) => (
                      <SelectItem key={key} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }}
          />
          <Field
            name="person"
            children={(field) => (
              <ControlledInput
                type="number"
                id="person"
                label="Person"
                field={field}
                prefix={<Users className="size-5" />}
              />
            )}
          />
          <Field
            name="jain_counter"
            children={(field) => (
              <ControlledInput
                type="number"
                id="jain_counter"
                label="Jain counter"
                field={field}
                prefix={<EthernetPort className="size-5" />}
              />
            )}
          />
          <Field
            name="venue"
            children={(field) => (
              <ControlledInput
                id="venue"
                label="Venue"
                field={field}
                prefix={<MapPinHouse className="size-5" />}
              />
            )}
          />
          <Field
            name="package_id"
            listeners={{
              onChange: async (e) => {
                if (!e.value) return setFieldValue("item", null);

                const packageOptionList =
                  (await packagesOption).result.list ?? [];

                const packageItem = packageOptionList.find(
                  (item) => item.package_id === e.value
                );

                const extraItem = {
                  pim_id: null,
                  name: "Extra Item",
                  deleteAble: true,
                };
                setFieldValue("item", [
                  ...(packageItem?.package_item ?? [])
                    .map((item) =>
                      Array.from({ length: item.quantity }).map(() => ({
                        ...item,
                      }))
                    )
                    .flat(),
                  extraItem,
                ]);
                setFieldValue("selling_price", packageItem?.price);
              },
            }}
            children={(field) => (
              <ControlledSearchableSelect
                id="package_id"
                label="Select package"
                field={field}
                prefix={<Package className="size-5" />}
                options={packagesOption}
                searchPlaceholder="Search party"
                prepareOption={(data) => {
                  const options = data.map((data) => ({
                    value: data.package_id,
                    label: data.name,
                  }));
                  options.push({ value: 0.69, label: "Custom Package" });
                  return options;
                }}
                updateTriggerer={field.state.value || isLoading}
              />
            )}
          />
        </div>
        <Field name="item" mode="array">
          {(field) => {
            const value = field.state.value ?? [];

            const groupWithCount = value.reduce((acc, item, index) => {
              const existing = acc.find((e) => e.pim_id === item.pim_id);
              if (existing) {
                existing.count += 1;
              } else {
                acc.push({ ...item, count: 1 });
              }
              item.index = index;
              return acc;
            }, []);

            return groupWithCount && groupWithCount.length ? (
              <>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                  {groupWithCount.map((item, i) => {
                    return (
                      <CoastingItem
                        key={i}
                        item={item}
                        Field={Field}
                        setFieldValue={setFieldValue}
                        getFieldValue={getFieldValue}
                        Subscribe={Subscribe}
                        store={store}
                        showPrice={showPrice}
                      />
                    );
                  })}
                </div>
                <Separator />
              </>
            ) : null;
          }}
        </Field>
        <div className="flex items-center justify-between">
          <div className="space-y-2 md:space-y-4">
            <div className="flex items-center gap-x-1 sm:gap-x-2">
              <Label className="text-xs sm:text-sm">Pro</Label>
              <Field
                name="pro"
                children={(field) => {
                  const MAX = 999;
                  return (
                    <Input
                      type="number"
                      className="w-full max-w-10 px-1 text-center text-sm md:text-base"
                      value={field.state.value}
                      onChange={(e) =>
                        e.target.valueAsNumber > MAX
                          ? setFieldValue("pro", getFieldValue("pro"))
                          : field.handleChange(e.target.valueAsNumber)
                      }
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  );
                }}
              />
              <span className="text-xs sm:text-sm">Extra</span>
            </div>
            <div className="flex items-center gap-x-1 sm:gap-x-2">
              <Label className="text-xs sm:text-sm">Bom. Boys</Label>
              <Field
                name="bom_boys"
                children={(field) => {
                  const MAX = 999;
                  return (
                    <Input
                      type="number"
                      className="w-full max-w-10 px-1 text-center text-sm md:text-base"
                      value={field.state.value}
                      onChange={(e) =>
                        e.target.valueAsNumber > MAX
                          ? setFieldValue("bom_boys", getFieldValue("bom_boys"))
                          : field.handleChange(e.target.valueAsNumber)
                      }
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  );
                }}
              />
              <span className="text-xs sm:text-sm">Extra</span>
            </div>
            <div className="flex items-center gap-x-1 sm:gap-x-2">
              <Label className="text-xs sm:text-sm">Packed Bottles</Label>
              <Field
                name="packed_bottle"
                children={(field) => {
                  const MAX = 99999;
                  return (
                    <Input
                      type="number"
                      className="w-full max-w-14 px-1 text-center"
                      value={field.state.value ?? ""}
                      onChange={(e) =>
                        e.target.valueAsNumber > MAX
                          ? setFieldValue(
                              "packed_bottle",
                              getFieldValue("packed_bottle")
                            )
                          : field.handleChange(e.target.valueAsNumber)
                      }
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  );
                }}
              />
              <span className="text-xs sm:text-sm">Extra</span>
            </div>
          </div>
          <div className="space-y-4">
            <Field
              name="per_plate_cost"
              children={(field) => (
                <ControlledInput
                  type="number"
                  id="per_plate_cost"
                  label="Per Plate Cost"
                  field={field}
                  value={getTotalCost() || ""}
                  prefix={<IndianRupee className="size-5" />}
                  disabled={true}
                  containerClassName={cn(
                    "transition-opacity",
                    showPrice.value ? "opacity-100" : "opacity-0"
                  )}
                />
              )}
            />
            <Field
              name="selling_price"
              children={(field) => (
                <ControlledInput
                  type="number"
                  id="selling_price"
                  label="Selling Price"
                  field={field}
                  prefix={<IndianRupee className="size-5" />}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

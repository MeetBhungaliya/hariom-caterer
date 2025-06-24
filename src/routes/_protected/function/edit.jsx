import { getAllPartyOption } from '@/api/select-options';
import ControlledDatepicker from '@/components/common/controlled-datepicker';
import { ControlledInput } from '@/components/common/controlled-input';
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { METHODS, pagination } from '@/constants/common';
import { GET_FUNCTIONS, UPDATE_FUNCTION } from '@/constants/endpoints';
import { useAuthStore } from '@/hooks/use-auth';
import { fetchApi } from '@/lib/api';
import { addEditFunctionSchema } from '@/lib/schema';
import { asyncResponseToaster } from '@/lib/toasts';
import { useForm, useStore } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { BadgeIndianRupee, Calendar, IndianRupee, MapPinHouse, NotebookPen, Plus, Trash2, UserRound, UsersRound } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Route as FunctionRoute } from './index';

export const Route = createFileRoute('/_protected/function/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { location } = useRouterState()
  const queryClient = useQueryClient()

  const defaultValues = useMemo(() => ({
    function_id: location.state.function_id,
    client_id: location.state.client_id || null,
    venue: location.state.venue || "",
    data: location.state.function_detail || [
      { date: null, function: "", person: "", rate: "", amount: 0 },
      { date: null, function: "", person: "", rate: "", amount: 0 },
      { date: null, function: "", person: "", rate: "", amount: 0 },
      { date: null, function: "", person: "", rate: "", amount: 0 },
      { date: null, function: "", person: "", rate: "", amount: 0 },
    ],
    pro: location.state.pro || { count: 0, rate: 0, total: 0 },
    bom_boys: location.state.bom_boys || { count: 0, rate: 0, total: 0 },
    bottle: location.state.bottle || { count: 0, rate: 0, total: 0 },
    decoration: location.state.decoration || { count: 0, rate: 0, total: 0 },
  }), [])

  const { Field, handleSubmit, Subscribe, store, setFieldValue, getFieldValue, reset } = useForm({
    onSubmit,
    defaultValues,
    validators: { onSubmit: addEditFunctionSchema },
  });

  const isLoading = useAuthStore(state => state.isLoading)
  const data = useStore(store, state => state.values.data)
  const proTotal = useStore(store, state => state.values.pro.total)
  const bottleTotal = useStore(store, state => state.values.bottle.total)
  const decorationTotal = useStore(store, state => state.values.decoration.total)

  const toNumber = (value) => isNaN(value) ? 0 : Number(value)

  const getTotalCost = useCallback(() => {
    const totalOfData = data.reduce((acc, curr) => acc += toNumber(curr.amount), 0)
    const total_amount = toNumber(totalOfData) + toNumber(proTotal) + toNumber(bottleTotal) + toNumber(decorationTotal)
    return total_amount
  }, [JSON.stringify(data), proTotal, bottleTotal, decorationTotal])

  const partiesOption = queryClient.ensureQueryData(getAllPartyOption())

  const updatedFunctionMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_FUNCTION, method: METHODS.PUT, data }),
  })

  async function onSubmit({ value }) {
    const deleted_fdm_ids = [];

    const currentItems = new Set(value.data.map((item) => item.fdm_id));
    const previousItems = Array.from(
      new Set(location.state.function_detail.map((item) => item.fdm_id))
    );

    location.state.function_detail.forEach((item) => {
      if (!item.fdm_id) { }
      const isInValue = currentItems.has(item.fdm_id);
      if (!isInValue) deleted_fdm_ids.push(item.fdm_id);
    });

    const filterdData = value.data.filter(
      (item) => !previousItems.includes(item.fdm_id)
    ).filter(item => item.date && item.function && item.person && item.rate);

    const payload = { ...value, data: filterdData, deleted_fdm_ids, total_amount: getTotalCost() }

    const result = await asyncResponseToaster(() => updatedFunctionMutation.mutateAsync(payload))

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.invalidateQueries({ queryKey: GET_FUNCTIONS })
      onClose()
    }
  }

  function onClose() {
    setTimeout(() => {
      navigate({ to: FunctionRoute.fullPath, search: pagination })
      reset()
    }, 150)
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
        <div className="h-full p-6 flex flex-col gap-y-6 bg-white rounded-xl overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
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
            <Button
              type="button"
              variant="outline"
              className="max-w-[180px] p-1.5 text-base bg-sky-600 rounded-lg border-transparent text-white hover:text-sky-600"
              onClick={() => {
                setFieldValue("data", [
                  ...getFieldValue("data"),
                  {
                    data: null,
                    function: "",
                    person: "",
                    rate: "",
                    amount: "",
                  },
                ]);
              }}
            >
              <Plus className="size-4 stroke-3" />
              Add Function
            </Button>
          </div>
          <div className="flex flex-col gap-y-4">
            <Separator />
            <ScrollArea className="h-[322px] pr-4">
              <div className="flex flex-col gap-y-2">
                {data.map((_, index) => {
                  return (
                    <div key={index} className="flex items-center gap-x-2">
                      <div className="w-full py-1 grid grid-cols-5 gap-4">
                        <Field
                          name={`data[${index}].date`}
                          children={(field) => (
                            <ControlledDatepicker
                              id={`data[${index}].date`}
                              label="Select date"
                              field={field}
                              icon={false}
                            />
                          )}
                        />
                        <Field
                          name={`data[${index}].function`}
                          children={(field) => (
                            <ControlledInput
                              id={`data[${index}].function`}
                              label="Function name"
                              field={field}
                            />
                          )}
                        />
                        <Field
                          name={`data[${index}].person`}
                          listeners={{
                            onChange: (e) => {
                              if (
                                getFieldValue(`data[${index}].rate`) &&
                                e.value
                              ) {
                                setFieldValue(
                                  `data[${index}].amount`,
                                  getFieldValue(`data[${index}].rate`) * e.value
                                );
                              }
                            },
                          }}
                          children={(field) => (
                            <ControlledInput
                              id={`data[${index}].person`}
                              label="Person"
                              type="number"
                              field={field}
                            />
                          )}
                        />
                        <Field
                          name={`data[${index}].rate`}
                          listeners={{
                            onChange: (e) => {
                              if (
                                getFieldValue(`data[${index}].person`) &&
                                e.value
                              ) {
                                setFieldValue(
                                  `data[${index}].amount`,
                                  getFieldValue(`data[${index}].person`) *
                                    e.value
                                );
                              }
                            },
                          }}
                          children={(field) => (
                            <ControlledInput
                              id={`data[${index}].rate`}
                              label="Rate"
                              type="number"
                              field={field}
                            />
                          )}
                        />
                        <Field
                          name={`data[${index}].amount`}
                          children={(field) => (
                            <ControlledInput
                              type="number"
                              id={`data[${index}].amount`}
                              label="Total amount"
                              field={field}
                              value={field.state.value || ""}
                              disabled={true}
                            />
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        className="p-3.5 border border-border-1 hover:bg-red-500 hover:border-red-500"
                        onClick={() =>
                          setFieldValue(
                            "data",
                            getFieldValue("data").filter((_, i) => i !== index)
                          )
                        }
                      >
                        <Trash2 className="size-5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="flex flex-col gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-x-2">
                  <Label>Pro</Label>
                  <div className="flex items-center gap-x-2">
                    <Field
                      name="pro.count"
                      children={(field) => {
                        const MAX = 999;
                        return (
                          <Input
                            type="number"
                            className="w-full max-w-20 px-1 text-center"
                            value={field.state.value || ""}
                            placeholder="Count"
                            onChange={(e) => {
                              if (e.target.valueAsNumber > MAX) {
                                setFieldValue(
                                  "pro.count",
                                  getFieldValue("pro.count")
                                );
                              } else {
                                field.handleChange(e.target.valueAsNumber);
                                if (getFieldValue(`pro.rate`)) {
                                  setFieldValue(
                                    `pro.total`,
                                    getFieldValue(`pro.rate`) *
                                      e.target.valueAsNumber
                                  );
                                }
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        );
                      }}
                    />
                    *
                    <Field
                      name="pro.rate"
                      children={(field) => {
                        const MAX = 100000;
                        return (
                          <Input
                            type="number"
                            className="w-full max-w-20 px-1 text-center"
                            value={field.state.value || ""}
                            placeholder="Rate"
                            onChange={(e) => {
                              if (e.target.valueAsNumber > MAX) {
                                setFieldValue(
                                  "pro.rate",
                                  getFieldValue("pro.rate")
                                );
                              } else {
                                field.handleChange(e.target.valueAsNumber);
                                if (getFieldValue(`pro.count`)) {
                                  setFieldValue(
                                    `pro.total`,
                                    getFieldValue(`pro.count`) *
                                      e.target.valueAsNumber
                                  );
                                }
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        );
                      }}
                    />
                    =
                    <Subscribe
                      selector={(state) => [
                        state.values.pro.count,
                        state.values.pro.rate,
                      ]}
                      children={([count, rate]) => {
                        const total = count * rate;
                        return (
                          <Field
                            name="pro.total"
                            children={(field) => {
                              const MAX = 100000;
                              return (
                                <Input
                                  type="number"
                                  className="w-full max-w-20 px-1 text-center"
                                  value={total ?? field.state.value ?? ""}
                                  placeholder="Total"
                                  disabled
                                  onChange={(e) =>
                                    e.target.valueAsNumber > MAX
                                      ? setFieldValue(
                                          "pro.total",
                                          getFieldValue("pro.total")
                                        )
                                      : field.handleChange(
                                          e.target.valueAsNumber
                                        )
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
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-x-2">
                  <Label>Bottle</Label>
                  <div className="flex items-center gap-x-2">
                    <Field
                      name="bottle.count"
                      children={(field) => {
                        const MAX = 999;
                        return (
                          <Input
                            type="number"
                            className="w-full max-w-20 px-1 text-center"
                            value={field.state.value || ""}
                            placeholder="Count"
                            onChange={(e) => {
                              if (e.target.valueAsNumber > MAX) {
                                setFieldValue(
                                  "bottle.count",
                                  getFieldValue("bottle.count")
                                );
                              } else {
                                field.handleChange(e.target.valueAsNumber);
                                if (getFieldValue(`bottle.rate`)) {
                                  setFieldValue(
                                    `bottle.total`,
                                    getFieldValue(`bottle.rate`) *
                                      e.target.valueAsNumber
                                  );
                                }
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        );
                      }}
                    />
                    *
                    <Field
                      name="bottle.rate"
                      children={(field) => {
                        const MAX = 100000;
                        return (
                          <Input
                            type="number"
                            className="w-full max-w-20 px-1 text-center"
                            value={field.state.value || ""}
                            placeholder="Rate"
                            onChange={(e) => {
                              if (e.target.valueAsNumber > MAX) {
                                setFieldValue(
                                  "bottle.rate",
                                  getFieldValue("bottle.rate")
                                );
                              } else {
                                field.handleChange(e.target.valueAsNumber);
                                if (getFieldValue(`bottle.count`)) {
                                  setFieldValue(
                                    `bottle.total`,
                                    getFieldValue(`bottle.count`) *
                                      e.target.valueAsNumber
                                  );
                                }
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        );
                      }}
                    />
                    =
                    <Subscribe
                      selector={(state) => [
                        state.values.bottle.count,
                        state.values.bottle.rate,
                      ]}
                      children={([count, rate]) => {
                        const total = count * rate;
                        return (
                          <Field
                            name="bottle.total"
                            children={(field) => {
                              const MAX = 100000;
                              return (
                                <Input
                                  type="number"
                                  className="w-full max-w-20 px-1 text-center"
                                  value={total ?? field.state.value ?? ""}
                                  placeholder="Total"
                                  disabled
                                  onChange={(e) =>
                                    e.target.valueAsNumber > MAX
                                      ? setFieldValue(
                                          "bottle.total",
                                          getFieldValue("bottle.total")
                                        )
                                      : field.handleChange(
                                          e.target.valueAsNumber
                                        )
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
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-x-2">
                  <Label>Bom. Boys</Label>
                  <div className="flex items-center gap-x-2">
                    <Field
                      name="bom_boys.count"
                      children={(field) => {
                        const MAX = 999;
                        return (
                          <Input
                            type="number"
                            className="w-full max-w-20 px-1 text-center"
                            value={field.state.value || ""}
                            placeholder="Count"
                            onChange={(e) => {
                              if (e.target.valueAsNumber > MAX) {
                                setFieldValue(
                                  "bom_boys.count",
                                  getFieldValue("bom_boys.count")
                                );
                              } else {
                                field.handleChange(e.target.valueAsNumber);
                                if (getFieldValue(`bom_boys.rate`)) {
                                  setFieldValue(
                                    `bom_boys.total`,
                                    getFieldValue(`bom_boys.rate`) *
                                      e.target.valueAsNumber
                                  );
                                }
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        );
                      }}
                    />
                    *
                    <Field
                      name="bom_boys.rate"
                      children={(field) => {
                        const MAX = 100000;
                        return (
                          <Input
                            type="number"
                            className="w-full max-w-20 px-1 text-center"
                            value={field.state.value || ""}
                            placeholder="Rate"
                            onChange={(e) => {
                              if (e.target.valueAsNumber > MAX) {
                                setFieldValue(
                                  "bom_boys.rate",
                                  getFieldValue("bom_boys.rate")
                                );
                              } else {
                                field.handleChange(e.target.valueAsNumber);
                                if (getFieldValue(`bom_boys.count`)) {
                                  setFieldValue(
                                    `bom_boys.total`,
                                    getFieldValue(`bom_boys.count`) *
                                      e.target.valueAsNumber
                                  );
                                }
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        );
                      }}
                    />
                    =
                    <Subscribe
                      selector={(state) => [
                        state.values.bom_boys.count,
                        state.values.bom_boys.rate,
                      ]}
                      children={([count, rate]) => {
                        const total = count * rate;
                        return (
                          <Field
                            name="bom_boys.total"
                            children={(field) => {
                              const MAX = 100000;
                              return (
                                <Input
                                  type="number"
                                  className="w-full max-w-20 px-1 text-center"
                                  value={total ?? field.state.value ?? ""}
                                  placeholder="Total"
                                  disabled
                                  onChange={(e) =>
                                    e.target.valueAsNumber > MAX
                                      ? setFieldValue(
                                          "bom_boys.total",
                                          getFieldValue("bom_boys.total")
                                        )
                                      : field.handleChange(
                                          e.target.valueAsNumber
                                        )
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
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-x-2">
                  <Label>Decoration</Label>
                  <div className="flex items-center gap-x-2">
                    <Field
                      name="decoration.count"
                      children={(field) => {
                        const MAX = 999;
                        return (
                          <Input
                            type="number"
                            className="w-full max-w-20 px-1 text-center"
                            value={field.state.value || ""}
                            placeholder="Count"
                            onChange={(e) => {
                              if (e.target.valueAsNumber > MAX) {
                                setFieldValue(
                                  "decoration.count",
                                  getFieldValue("decoration.count")
                                );
                              } else {
                                field.handleChange(e.target.valueAsNumber);
                                if (getFieldValue(`decoration.rate`)) {
                                  setFieldValue(
                                    `decoration.total`,
                                    getFieldValue(`decoration.rate`) *
                                      e.target.valueAsNumber
                                  );
                                }
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        );
                      }}
                    />
                    *
                    <Field
                      name="decoration.rate"
                      children={(field) => {
                        const MAX = 100000;
                        return (
                          <Input
                            type="number"
                            className="w-full max-w-20 px-1 text-center"
                            value={field.state.value || ""}
                            placeholder="Rate"
                            onChange={(e) => {
                              if (e.target.valueAsNumber > MAX) {
                                setFieldValue(
                                  "decoration.rate",
                                  getFieldValue("decoration.rate")
                                );
                              } else {
                                field.handleChange(e.target.valueAsNumber);
                                if (getFieldValue(`decoration.count`)) {
                                  setFieldValue(
                                    `decoration.total`,
                                    getFieldValue(`decoration.count`) *
                                      e.target.valueAsNumber
                                  );
                                }
                              }
                            }}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        );
                      }}
                    />
                    =
                    <Subscribe
                      selector={(state) => [
                        state.values.decoration.count,
                        state.values.decoration.rate,
                      ]}
                      children={([count, rate]) => {
                        const total = count * rate;
                        return (
                          <Field
                            name="decoration.total"
                            children={(field) => {
                              const MAX = 100000;
                              return (
                                <Input
                                  type="number"
                                  className="w-full max-w-20 px-1 text-center"
                                  value={total ?? field.state.value ?? ""}
                                  placeholder="Total"
                                  disabled
                                  onChange={(e) =>
                                    e.target.valueAsNumber > MAX
                                      ? setFieldValue(
                                          "decoration.total",
                                          getFieldValue("decoration.total")
                                        )
                                      : field.handleChange(
                                          e.target.valueAsNumber
                                        )
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
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Field
                name="total_amount"
                children={(field) => (
                  <ControlledInput
                    type="number"
                    id="total_amount"
                    label="Total Amount"
                    field={field}
                    value={getTotalCost() || ""}
                    prefix={<IndianRupee className="size-5" />}
                    disabled={true}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { getOrderItemList, getOrdersList } from '@/api/query-option'
import { getAllPackageOption, getAllPartyOption } from '@/api/select-options'
import { CoastingItem } from '@/components/coasting-item'
import ControlledDatepicker from '@/components/common/controlled-datepicker'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { METHODS, pagination, TIME_OPTIONS } from '@/constants/common'
import { UPDATE_COASTING } from '@/constants/endpoints'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { addEditCoastingSchema } from '@/lib/schema'
import { asyncResponseToaster } from '@/lib/toasts'
import { cn } from '@/lib/utils'
import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { Calendar, EthernetPort, IndianRupee, MapPinHouse, Package, Timer, UserRound, Users } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { Route as OrderRoute } from './index'
import { STATUS_OPTIONS } from '@/lib/schema/common'
import { useBoolean } from 'usehooks-ts'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export const Route = createFileRoute('/_protected/coasting/$order_id')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { location } = useRouterState()
  const order_id = Route.useParams({ select: params => params.order_id })

  const queryClient = useQueryClient()

  const showPrice = useBoolean(false)

  const orderItemsList = useQuery(getOrderItemList({ order_id }))

  useEffect(() => {
    const items = orderItemsList.data.result.items || []

    const packageItems = []

    items.forEach(item => {
      item.order_item.forEach(orderItem => {
        packageItems.push({
          item_id: orderItem.item_id,
          pim_id: orderItem.pim_id,
          oim_id: orderItem.oim_id,
          price: orderItem.price,
          name: item.name,
        })
      })
    })
    setFieldValue('item', packageItems)
  }, [orderItemsList.isFetching]);

  const updateCoastingMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_COASTING, method: METHODS.PUT, data }),
  })

  const { Field, handleSubmit, Subscribe, setFieldValue, getFieldValue, reset, store } = useForm({
    onSubmit,
    validators: { onSubmit: addEditCoastingSchema },
    defaultValues: {
      order_id: location.state.order_id,
      client_id: location.state.client_id,
      package_id: location.state.package_id,
      date: new Date(location.state.date),
      time: location.state.time,
      person: location.state.person,
      venue: location.state.venue,
      status: location.state.status,
      jain_counter: location.state.jain_counter,
      per_plate_cost: location.state.per_plate_cost,
      selling_price: location.state.selling_price,
      pro: location.state.pro,
      bom_boys: location.state.bom_boys,
      packed_bottle: location.state.packed_bottle,
    },
  })

  const items = useStore(store, state => state.values.item)

  const getTotalCost = useCallback(() => {
    return (items ?? []).reduce((acc, item) => acc + (item.price ?? 0), 0)
  }, [JSON.stringify(items)])

  useEffect(() => {
    setFieldValue('per_plate_cost', getTotalCost())
  }, [JSON.stringify(items)]);

  const isLoading = useAuthStore(state => state.isLoading)

  const partiesOption = queryClient.ensureQueryData(getAllPartyOption())
  const packagesOption = queryClient.ensureQueryData(getAllPackageOption())

  async function onSubmit({ value }) {

    const item = value.item.map(item => ({
      pim_id: Number(item.pim_id),
      item_id: Number(item.item_id),
      ...(item.oim_id ? { oim_id: Number(item.oim_id) } : {})
    }))


    const payload = {
      ...value,
      item,
      pro: value.pro ?? 0,
      bom_boys: value.bom_boys ?? 0,
      packed_bottle: value.packed_bottle ?? 0,
    }

    const result = await asyncResponseToaster(() => updateCoastingMutation.mutateAsync(payload))

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getOrdersList)
      onClose()
    }
  }

  function onClose() {
    setTimeout(() => {
      navigate({ to: OrderRoute.fullPath, search: pagination })
      reset()
    }, 150)
  }

  if (orderItemsList.isError)
    return null

  return (
    <div className='h-full flex flex-col gap-y-6 overflow-hidden'>
      <div className="bg-white p-4 rounded-xl flex items-center justify-end gap-x-4">
        <Switch
          className="size-auto w-16 h-7 [&>*:first-child]:size-5 [&>*:first-child]:data-[state=unchecked]:translate-x-1 [&>*:first-child]:data-[state=checked]:translate-x-[38px] data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-sky-600"
          checked={showPrice.value}
          onCheckedChange={showPrice.toggle}
        />
        <Subscribe
          selector={state => state.isDirty}
          children={isDirty => (
            <Button
              type="button"
              className="w-full max-w-[160px] py-2 text-base bg-sky-600 text-white"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleSubmit()
              }}
              disabled={!isDirty}
            >
              Update
            </Button>
          )}
        />
      </div>
      <div className='h-full p-6 flex flex-col gap-y-6 bg-white rounded-xl overflow-hidden'>
        <div className='grid grid-cols-3 gap-4'>
          <Field
            name="client_id"
            children={field => (
              <ControlledSearchableSelect
                id="client_id"
                label="Select party"
                field={field}
                prefix={<UserRound className="size-5" />}
                options={partiesOption}
                searchPlaceholder="Search party"
                prepareOption={data => data.map(data => ({ value: data.client_id, label: data.name }))}
                updateTriggerer={field.state.value || isLoading}
              />
            )}
          />
          <Field
            name="package_id"
            listeners={{
              onChange: async (e) => {
                const packageItem = (((await packagesOption).result.list ?? []).find(item => item.package_id === e.value)?.package_item)
                setFieldValue('item', packageItem)
              }
            }}
            children={field => (
              <ControlledSearchableSelect
                id="package_id"
                label="Select package"
                field={field}
                prefix={<Package className="size-5" />}
                options={packagesOption}
                searchPlaceholder="Search party"
                prepareOption={data => data.map(data => ({ value: data.package_id, label: data.name }))}
                updateTriggerer={field.state.value || isLoading}
              />
            )}
          />
          <Field
            name="date"
            children={field => (
              <ControlledDatepicker
                id="date"
                label="Select date"
                field={field}
                prefix={<Calendar className="size-5" />}
              />
            )}
          />
          <Field
            name="person"
            children={field => (
              <ControlledInput
                type='number'
                id="person"
                label="Person"
                field={field}
                prefix={<Users className="size-5" />}
              />
            )}
          />
          <Field
            name="jain_counter"
            children={field => (
              <ControlledInput
                type='number'
                id="jain_counter"
                label="Jain counter"
                field={field}
                prefix={<EthernetPort className="size-5" />}
              />
            )}
          />
          <Field
            name="time"
            children={(field) => {
              const errorMsg = field.state.meta.errors?.[0]?.message
              return (
                <Select defaultValue={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger icon
                    className={cn("w-full !h-full gap-3 p-0 text-sm md:text-base justify-start font-medium rounded-lg",
                      errorMsg ? "border-red-500 data-[placeholder]:text-red-500" : "data-[placeholder]:text-gray-500 border-gray-300"
                    )}
                  >
                    <div className='h-full aspect-square flex items-center justify-center rounded-l-lg bg-sky-600 text-white'>
                      <Timer />
                    </div>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent align="middle" className="min-w-20">
                    {TIME_OPTIONS.map((item, key) => (
                      <SelectItem key={key} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }}
          />
          <Field
            name="venue"
            children={field => (
              <ControlledInput
                id="venue"
                label="Venue"
                field={field}
                prefix={<MapPinHouse className="size-5" />}
              />
            )}
          />
          <Field
            name="status"
            children={(field) => {
              const errorMsg = field.state.meta.errors?.[0]?.message
              return (
                <Select defaultValue={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger icon
                    className={cn("w-full !h-full gap-3 p-0 text-sm md:text-base justify-start font-medium rounded-lg",
                      errorMsg ? "border-red-500 data-[placeholder]:text-red-500" : "data-[placeholder]:text-gray-500 border-gray-300"
                    )}
                  >
                    <div className='h-full aspect-square flex items-center justify-center rounded-l-lg bg-sky-600 text-white'>
                      <Timer />
                    </div>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent align="middle" className="min-w-20">
                    {STATUS_OPTIONS.map((item, key) => (
                      <SelectItem key={key} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
            }}
          />
        </div>
        <Field name="item" mode="array">
          {(field) => {
            const value = field.state.value ?? []

            const groupWithCount = value.reduce((acc, item, index) => {
              const existing = acc.find(e => e.pim_id === item.pim_id);
              if (existing) {
                existing.count += 1
              } else {
                acc.push({ ...item, count: 1 });
              }
              item.index = index;
              return acc;
            }, []);

            return groupWithCount && groupWithCount.length
              ? <>
                <Separator />
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
                      />)
                  })}
                </div>
                <Separator />
              </>
              : null
          }}
        </Field>
        {/* <Field name="item" mode="array">
              {(field) => {
                const value = field.state.value ?? []
                return value.map((item, i) => {
                  return (
                    <CoastingItem
                      key={i + item.pim_id}
                      index={i}
                      item={item}
                      Field={Field}
                      Subscribe={Subscribe}
                      setFieldValue={setFieldValue}
                      getFieldValue={getFieldValue}
                      store={store}
                      showPrice={showPrice}
                    />
                  )
                })
              }}
            </Field> */}
        <div className='flex items-center justify-between'>
          <div className='space-y-4'>
            <div className='flex items-center gap-x-2'>
              <Label>Pro</Label>
              <Field
                name="pro"
                children={field => {
                  const MAX = 999
                  return (
                    <Input
                      type="number"
                      className="w-full max-w-10 px-1 text-center"
                      value={field.state.value}
                      onChange={e => e.target.valueAsNumber > MAX ? setFieldValue('pro', getFieldValue('pro')) : field.handleChange(e.target.valueAsNumber)}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault()
                        }
                      }}
                    />
                  )
                }}
              />
              <span className='text-sm'>Extra</span>
            </div>
            <div className='flex items-center gap-x-2'>
              <Label>Bom. Boys</Label>
              <Field
                name="bom_boys"
                children={field => {
                  const MAX = 999
                  return (
                    <Input
                      type="number"
                      className="w-full max-w-10 px-1 text-center"
                      value={field.state.value}
                      onChange={e => e.target.valueAsNumber > MAX ? setFieldValue('bom_boys', getFieldValue('bom_boys')) : field.handleChange(e.target.valueAsNumber)}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault()
                        }
                      }}
                    />
                  )
                }}
              />
              <span className='text-sm'>Extra</span>
            </div>
            <div className='flex items-center gap-x-2'>
              <Label>Packed Bottles</Label>
              <Field
                name="packed_bottle"
                children={field => {
                  const MAX = 99999
                  return (
                    <Input
                      type="number"
                      className="w-full max-w-14 px-1 text-center"
                      value={field.state.value ?? ""}
                      onChange={e => e.target.valueAsNumber > MAX ? setFieldValue('packed_bottle', getFieldValue('packed_bottle')) : field.handleChange(e.target.valueAsNumber)}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault()
                        }
                      }}
                    />
                  )
                }}
              />
              <span className='text-sm'>Extra</span>
            </div>
          </div>
          <div className='space-y-4'>
            <Field
              name="per_plate_cost"
              children={field => (
                <ControlledInput
                  type='number'
                  id="per_plate_cost"
                  label="Per Plate Cost"
                  field={field}
                  value={getTotalCost() || ""}
                  prefix={<IndianRupee className="size-5" />}
                  disabled={true}
                  containerClassName={cn("transition-opacity", showPrice.value ? "opacity-0" : "opacity-full")}
                />
              )}
            />
            <Field
              name="selling_price"
              children={field => (
                <ControlledInput
                  type='number'
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
  )
}

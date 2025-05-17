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
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouterState } from '@tanstack/react-router'
import { Calendar, EthernetPort, MapPinHouse, Package, Timer, UserRound, Users } from 'lucide-react'
import { useEffect } from 'react'
import { Route as OrderRoute } from './index'
import { STATUS_OPTIONS } from '@/lib/schema/common'

export const Route = createFileRoute('/_protected/coasting/$order_id')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { location } = useRouterState()
  const order_id = Route.useParams({ select: params => params.order_id })

  const queryClient = useQueryClient()

  const orderItemsList = useQuery(getOrderItemList({ order_id }))

  useEffect(() => {
    const items = orderItemsList.data.result.items || []

    const filteredExtraItems = items.filter(item => item.pim_id)

    const packageItems = []

    filteredExtraItems.forEach(item => {
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

  const { Field, handleSubmit, Subscribe, setFieldValue, getFieldValue, reset } = useForm({
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
      <div className="bg-white p-4 rounded-xl flex justify-end gap-x-4">
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
        <Separator />
        <ScrollArea className="h-full pr-3 overflow-hidden">
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto'>
            <Field name="item" mode="array">
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
                    />
                  )
                })
              }}
            </Field>
          </div>
        </ScrollArea>
        <Separator />
      </div>
    </div>
  )
}

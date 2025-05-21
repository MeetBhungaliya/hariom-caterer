import { getOrdersList } from '@/api/query-option'
import { getAllPackageOption, getAllPartyOption } from '@/api/select-options'
import { CoastingItem } from '@/components/coasting-item'
import ControlledDatepicker from '@/components/common/controlled-datepicker'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from '@/components/ui/separator'
import { METHODS, pagination, TIME_OPTIONS } from '@/constants/common'
import { ADD_COASTING } from '@/constants/endpoints'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { addEditCoastingSchema } from '@/lib/schema'
import { STATUS_OPTIONS } from '@/lib/schema/common'
import { asyncResponseToaster } from '@/lib/toasts'
import { cn } from '@/lib/utils'
import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Calendar, EthernetPort, IndianRupee, MapPinHouse, Package, Timer, UserRound, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Route as OrderRoute } from './index'
import { Switch } from '@/components/ui/switch'
import { useBoolean, useToggle } from 'usehooks-ts'

export const Route = createFileRoute('/_protected/coasting/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()

  const showPrice = useBoolean(false)

  const addCoastingMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_COASTING, method: METHODS.POST, data }),
  })

  const { Field, handleSubmit, Subscribe, setFieldValue, getFieldValue, reset, store } = useForm({
    onSubmit,
    validators: { onSubmit: addEditCoastingSchema },
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
      pim_id: item.pim_id ?? null,
      item_id: Number(item.item_id),
    }))

    const payload = {
      ...value,
      item,
      pro: value.pro ?? 0,
      bom_boys: value.bom_boys ?? 0,
      packed_bottle: value.packed_bottle ?? 0,
    }

    const result = await asyncResponseToaster(() => addCoastingMutation.mutateAsync(payload))

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
              Add
            </Button>
          )}
        />
      </div>
      <div className='h-full p-6 flex flex-col gap-y-6 bg-white rounded-xl overflow-y-auto'>
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
          <Field
            name="package_id"
            listeners={{
              onChange: async (e) => {
                if (!e.value) return setFieldValue('item', null)

                const packageItem = (((await packagesOption).result.list ?? []).find(item => item.package_id === e.value)?.package_item)
                const extraItem = { pim_id: null, name: "Extra Item", deleteAble: true }
                setFieldValue('item', [...packageItem, extraItem])
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
        </div>
        <Field name="item" mode="array">
          {(field) => {
            const value = field.state.value ?? []
            return value.length
              ? <>
                <Separator />
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {value.map((item, i) => {
                    return <CoastingItem key={i} index={i} item={item} Field={Field} setFieldValue={setFieldValue} getFieldValue={getFieldValue} Subscribe={Subscribe} showPrice={showPrice} />
                  })}
                </div>
                <Separator />
              </>
              : null
          }}
        </Field>
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

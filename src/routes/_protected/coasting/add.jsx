import { getAllPacakgeOption, getAllPartyOption } from '@/api/select-options'
import ControlledDatepicker from '@/components/common/controlled-datepicker'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TIME_OPTIONS } from '@/constants/common'
import { paginationSchema } from '@/lib/schema/common'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { BadgeIndianRupee, Calendar, EthernetPort, MapPinHouse, Package, Timer, UserRound, Users } from 'lucide-react'

export const Route = createFileRoute('/_protected/coasting/add')({
  component: RouteComponent,
  validateSearch: search => paginationSchema.parse(search),
})

function RouteComponent() {
  const queryClient = useQueryClient()

  const { Field, handleSubmit, Subscribe, store } = useForm({
    onSubmit,
  })

  const partiesOption = queryClient.ensureQueryData(getAllPartyOption())
  const packagesOption = queryClient.ensureQueryData(getAllPacakgeOption())

  async function onSubmit({ value }) { }

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
              Add
            </Button>
          )}
        />
      </div>
      <div className='h-full p-6 flex flex-col gap-y-6 bg-white rounded-xl overflow-hidden'>
        <div className='grid grid-cols-3 gap-6'>
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
                updateTriggerer={field.state.value}
              />
            )}
          />
          <Field
            name="package_id"
            children={field => (
              <ControlledSearchableSelect
                id="package_id"
                label="Select package"
                field={field}
                prefix={<Package className="size-5" />}
                options={packagesOption}
                searchPlaceholder="Search party"
                prepareOption={data => data.map(data => ({ value: data.package_id, label: data.name }))}
                updateTriggerer={field.state.value}
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
                id="jain_counter"
                label="Jain Counter"
                field={field}
                prefix={<EthernetPort className="size-5" />}
              />
            )}
          />
          <Field
            name="time"
            children={(field) => {
              return (
                <Select defaultValue={field.state.value} onValueChange={field.state.onChange}>
                  <SelectTrigger className="w-full !h-full gap-3 p-0 text-sm md:text-base justify-start font-medium border-gray-300 data-[placeholder]:text-gray-500 rounded-lg">
                    <div className='h-full aspect-square flex items-center justify-center rounded-l-lg bg-sky-600 text-white'>
                      <Timer />
                    </div>
                    <SelectValue placeholder="Select item" />
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
            name="per_plate_cost"
            children={field => (
              <ControlledInput
                id="per_plate_cost"
                label="Per Plate Cost"
                field={field}
                prefix={<BadgeIndianRupee className="size-5" />}
              />
            )}
          />
          <Field
            name="selling_price"
            children={field => (
              <ControlledInput
                id="selling_price"
                label="Selling Price"
                field={field}
                prefix={<BadgeIndianRupee className="size-5" />}
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}

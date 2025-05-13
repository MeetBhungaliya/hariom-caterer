import { getAllPacakgeOption, getAllPartyOption } from '@/api/select-options'
import ControlledDatepicker from '@/components/common/controlled-datepicker'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { Button } from '@/components/ui/button'
import { paginationSchema } from '@/lib/schema/common'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Package, UserRound } from 'lucide-react'

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
                extendContent={
                  <Field
                    name="time"
                    children={field => (
                      <ControlledDatepicker
                        id="time"
                        label="Select date"
                        field={field}
                        prefix={<Calendar className="size-5" />}
                      />
                    )}
                  />
                }
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}

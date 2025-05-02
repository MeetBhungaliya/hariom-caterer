import { getAllCrockeryOption } from '@/api/select-options'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { addEditItemCrockerySchema } from '@/lib/schema'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { UtensilsCrossed } from 'lucide-react'
import { useCallback } from 'react'

const AddEditItemCrockery = ({ modalState, data, setData, filterCrockeryData }) => {
  const queryClient = useQueryClient()

  const crockeriesOption = queryClient.ensureQueryData(getAllCrockeryOption({ paginate: false }))

  const { Field, handleSubmit, Subscribe, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addEditItemCrockerySchema },
    defaultValues: data,
  })

  async function onSubmit({ value }) {

    const result = await crockeriesOption

    if (!result || result.ResponseCode !== 1 || !result?.result?.list) return

    const crockeryDetail = result.result.list.find(data => data.crockery_id === value.crockery_id)

    setData(prev => [...prev, crockeryDetail])

    onClose()
  }

  const filterOptions = useCallback(
    options => {
      if (!modalState.value) return []

      const filteredOptions = []

      options.forEach(option => {
        const isOptionInFilter = filterCrockeryData.some(data => data.crockery_id === option.value)
        if (!isOptionInFilter) {
          filteredOptions.push(option)
        }
      })

      return filteredOptions
    },
    [modalState.value])


  function onClose() {
    setTimeout(() => {
      modalState.setFalse()
      reset({ crockery_id: undefined })
    }, 150)
  }


  return (
    <Dialog
      open={modalState.value}
      onOpenChange={(e) => {
        if (!e)
          onClose()
        modalState.setValue(e)
      }}
    >
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-6 py-4 bg-bg-1 rounded-t-xl shadow">
          <DialogTitle className="text-center text-xl font-bold">
            Add Crockery
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>select crockery</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit()
          }}
        >
          <div className="p-6 space-y-6">
            <Field
              name="crockery_id"
              children={field => (
                <ControlledSearchableSelect
                  id="crockery_id"
                  label="Select crockery"
                  field={field}
                  prefix={<UtensilsCrossed className="size-5" />}
                  options={crockeriesOption}
                  searchPlaceholder="Search crockery"
                  prepareOption={data => data.map(data => ({ value: data.crockery_id, label: data.name }))}
                  updateTriggerer={field.state.value}
                  filterFn={filterOptions}
                />
              )}
            />
          </div>
          <div className="w-full h-[1px] shadow bg-bg-1" />
          <DialogFooter className="px-6 py-4 gap-x-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="py-2 text-base border border-transparent hover:border">
                Cancel
              </Button>
            </DialogClose>
            <Subscribe
              selector={state => state.isDirty}
              children={isDirty => (
                <Button
                  type="submit"
                  className="py-2 text-base bg-sky-600 text-white"
                  disabled={!isDirty}
                >
                  Save
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditItemCrockery
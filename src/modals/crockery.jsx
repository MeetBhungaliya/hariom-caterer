import { getCrockeryList } from '@/api/query-option'
import { ControlledInput } from '@/components/common/controlled-input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { METHODS } from '@/constants/common'
import { ADD_CROCKERY, UPDATE_CROCKERY } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { addEditCrockerSchema } from '@/lib/schema'
import { asyncResponseToaster } from '@/lib/toasts'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Calculator, UserPen, UsersRound } from 'lucide-react'

function AddEditCrockery({ modalState, data, setData }) {
  const queryClient = useQueryClient()

  const addCrockeryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_CROCKERY, method: METHODS.POST, data }),
  })

  const updateCrockeryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_CROCKERY, method: METHODS.PUT, data }),
  })

  const { Field, handleSubmit, Subscribe, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addEditCrockerSchema },
    defaultValues: data,
  })

  async function onSubmit({ value }) {
    let result = null

    if ('crockery_id' in value) {
      result = await asyncResponseToaster(() => updateCrockeryMutation.mutateAsync(value))
    }
    else {
      result = await asyncResponseToaster(() => addCrockeryMutation.mutateAsync(value))
    }

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getCrockeryList)
      onClose()
    }
  }

  function onClose() {
    setTimeout(() => {
      modalState.setFalse()
      reset({ name: undefined, name_hi: undefined, person: undefined, quantity: undefined })
      setData(undefined)
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
            {data ? 'Update' : 'Add'}
            &nbsp;
            Crockery
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>add or update crockery information</DialogDescription>
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
              name="name"
              children={field => (
                <ControlledInput
                  id="name"
                  label="Crockery name"
                  field={field}
                  prefix={<UserPen className="size-5" />}
                />
              )}
            />
            <Field
              name="name_hi"
              children={field => (
                <ControlledInput
                  id="name_hi"
                  label="Crockery name hindi"
                  field={field}
                  prefix={<UserPen className="size-5" />}
                />
              )}
            />
            <Field
              name="person"
              children={field => (
                <ControlledInput
                  id="person"
                  label="Person"
                  type="number"
                  field={field}
                  prefix={<UsersRound className="size-5" />}
                />
              )}
            />
            <Field
              name="quantity"
              children={field => (
                <ControlledInput
                  id="quantity"
                  label="Quantity"
                  type="number"
                  field={field}
                  prefix={<Calculator className="size-5" />}
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
                  disabled={!isDirty || addCrockeryMutation.isPending || updateCrockeryMutation.isPending}
                >
                  {data ? 'Update' : 'Save'}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddEditCrockery

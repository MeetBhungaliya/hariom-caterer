import { getPartiesList } from '@/api/query-option'
import { ControlledInput } from '@/components/common/controlled-input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { METHODS } from '@/constants/common'
import { ADD_PARTY, UPDATE_PARTY } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { addEditPartySchema } from '@/lib/schema'
import { asyncResponseToaster } from '@/lib/toasts'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PhoneCall, UserPen } from 'lucide-react'

function AddEditParty({ modalState, data, setData }) {
  const queryClient = useQueryClient()

  const addPartyMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_PARTY, method: METHODS.POST, data }),
  })

  const updatePartyMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_PARTY, method: METHODS.PUT, data }),
  })

  const { Field, handleSubmit, Subscribe, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addEditPartySchema },
    defaultValues: data,
  })

  async function onSubmit({ value }) {
    let result = null

    if ('client_id' in value) {
      result = await asyncResponseToaster(() => updatePartyMutation.mutateAsync(value))
    }
    else {
      result = await asyncResponseToaster(() => addPartyMutation.mutateAsync(value))
    }

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getPartiesList)
    }
  }

  function onClose() {
    setTimeout(() => {
      modalState.setFalse()
      reset({ name: undefined, phone: undefined })
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
            {' '}
            Party
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>add or update party information</DialogDescription>
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
                  label="Party name"
                  field={field}
                  prefix={<UserPen className="size-5" />}
                />
              )}
            />
            <Field
              name="phone"
              children={field => (
                <ControlledInput
                  id="phone"
                  label="Phone number"
                  type="number"
                  field={field}
                  prefix={<PhoneCall className="size-5" />}
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
                  className="py-2 text-base"
                  disabled={!isDirty || addPartyMutation.isPending}
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

export { AddEditParty }

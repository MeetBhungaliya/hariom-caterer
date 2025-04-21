import { getCategoryList } from '@/api/query-option'
import { ControlledInput } from '@/components/common/controlled-input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { METHODS } from '@/constants/common'
import { ADD_CATEGORY, UPDATE_CATEGORY } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { addEditCategorySchema } from '@/lib/schema'
import { asyncResponseToaster } from '@/lib/toasts'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserPen } from 'lucide-react'

function AddEditCategoryModal({ modalState, data, setData }) {
  const queryClient = useQueryClient()

  const addCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_CATEGORY, method: METHODS.POST, data }),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_CATEGORY, method: METHODS.PUT, data }),
  })

  const { Field, handleSubmit, Subscribe, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addEditCategorySchema },
    defaultValues: data,
  })

  async function onSubmit({ value }) {
    let result = null

    if ('category_id' in value) {
      result = await asyncResponseToaster(() => updateCategoryMutation.mutateAsync(value))
    }
    else {
      result = await asyncResponseToaster(() => addCategoryMutation.mutateAsync(value))
    }

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getCategoryList)
      onClose()
    }
  }

  function onClose() {
    setTimeout(() => {
      modalState.setFalse()
      reset({ name: undefined })
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
            Category
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>add or update category information</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit()
          }}
        >
          <div className="p-6">
            <Field
              name="name"
              children={field => (
                <ControlledInput
                  id="name"
                  label="Category name"
                  field={field}
                  prefix={<UserPen className="size-5" />}
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
                  disabled={!isDirty || addCategoryMutation.isPending || updateCategoryMutation.isPending}
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

export { AddEditCategoryModal }

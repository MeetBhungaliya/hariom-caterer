import { getCategoryList } from '@/api/query-option'
import { getAllCrockeryOption } from '@/api/select-options'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledMultipleSelector } from '@/components/common/controlled-multiselector'
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
import { UserPen, UtensilsCrossed } from 'lucide-react'
import { useEffect, useState } from 'react'

function AddEditCategoryModal({ modalState, data, setData }) {
  const [crockeriesOptions, setCrockeriesOptions] = useState([]);

  const queryClient = useQueryClient()
  const addCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_CATEGORY, method: METHODS.POST, data }),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_CATEGORY, method: METHODS.PUT, data }),
  })

  const crockeriesOption = queryClient.ensureQueryData(getAllCrockeryOption())

  useEffect(() => {
    if (!modalState.value) return

    crockeriesOption.then(res => {
      const data = res?.result?.list
      setCrockeriesOptions(data.map(option => ({ value: option.crockery_id, label: option.name })))
    })
  }, [modalState.value]);

  const { Field, handleSubmit, Subscribe, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addEditCategorySchema },
    defaultValues: data ? {
      name: data.name,
      category_id: data.category_id,
      crockery_ids: data?.crockery_item ? data.crockery_item.map(item => ({ value: item.crockery_id, label: item.crockery.name })) : []
    } : { crockery_ids: [] },
  })

  async function onSubmit({ value }) {
    let result = null

    const payload = { ...value, crockery_ids: value.crockery_ids.map(item => item.value) }

    if ('category_id' in value) {
      const deleted_crockery_ids = []

      const currentItems = new Set(value.crockery_ids.map(item => item.value))

      data.crockery_item.forEach(item => {
        if (!item.crockery_id) { }
        const isInValue = currentItems.has(item.crockery_id)
        if (!isInValue) deleted_crockery_ids.push(item.crockery_id)
      })

      result = await asyncResponseToaster(() => updateCategoryMutation.mutateAsync({ ...payload, deleted_crockery_ids }))
    }
    else {
      result = await asyncResponseToaster(() => addCategoryMutation.mutateAsync(payload))
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
          <div className="p-6 space-y-6">
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
            <Field
              name="crockery_ids"
              children={field => (
                <ControlledMultipleSelector
                  id="name"
                  label="Select crockeries"
                  field={field}
                  prefix={<UtensilsCrossed className="size-5" />}
                  options={crockeriesOptions}
                  removeAll={false}
                  emptyIndicator="No crockeries left"
                  value={field.state.value ?? []}
                  onChange={field.handleChange}
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

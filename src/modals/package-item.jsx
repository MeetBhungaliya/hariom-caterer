import { getPackageItemList } from '@/api/query-option'
import { getCategoriesOption } from '@/api/select-options'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledMultipleSelector } from '@/components/common/controlled-multiselector'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { METHODS } from '@/constants/common'
import { ADD_PACKAGE_ITEM, UPDATE_PACKAGE_ITEM } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { addEditCategorySchema } from '@/lib/schema'
import { asyncResponseToaster } from '@/lib/toasts'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Package, UserPen } from 'lucide-react'
import { useEffect, useState } from 'react'

function AddEditPackageItem({ modalState, data, setData }) {

  const [categoryOptions, setCategoryOptions] = useState([]);

  const queryClient = useQueryClient()

  const addPackageItemMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_PACKAGE_ITEM, method: METHODS.POST, data }),
  })

  const updatePackageItemMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_PACKAGE_ITEM, method: METHODS.PUT, data }),
  })

  const categoriesOption = queryClient.ensureQueryData(getCategoriesOption({ paginate: false }))

  useEffect(() => {
    if (!modalState.value) return

    categoriesOption.then(res => {
      const data = res?.result?.list
      setCategoryOptions(data.map(option => ({ value: option.category_id, label: option.name })))
    })
  }, [modalState.value]);

  const { Field, handleSubmit, Subscribe, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addEditCategorySchema },
    defaultValues: data ? {name: data.name, pim_id: data.pim_id, category_ids: data.categories.map(item=>({value: item.category_id, label: item.name}))}:{},
  })

  async function onSubmit({ value }) {
    let result = null
    console.log(value)
    return

    if ('pim_id' in value) {
      result = await asyncResponseToaster(() => updatePackageItemMutation.mutateAsync(value))
    }
    else {
      result = await asyncResponseToaster(() => addPackageItemMutation.mutateAsync(value))
    }

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getPackageItemList)
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
            Package Item
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>add or update package item</DialogDescription>
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
                  label="Package Item name"
                  field={field}
                  prefix={<UserPen className="size-5" />}
                />
              )}
            />
            <Field
              name="category_ids"
              children={field => (
                <ControlledMultipleSelector
                  id="name"
                  label="Package Item name"
                  field={field}
                  prefix={<Package className="size-5" />}
                  options={categoryOptions}
                  removeAll={false}
                  emptyIndicator="No Package Item left"
                  value={field.state.value ?? []}
                  onChange={data => field.handleChange(data.map(d => d.value))}
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
                  disabled={!isDirty || addPackageItemMutation.isPending || updatePackageItemMutation.isPending}
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

export { AddEditPackageItem }


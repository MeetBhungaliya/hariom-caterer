import { getCategoryList } from '@/api/query-option'
import { getCategoriesOption, getSubCategoriesOption } from '@/api/select-options'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { ControlledTagInput } from '@/components/common/controlled-taginput'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { METHODS } from '@/constants/common'
import { ADD_CATEGORY, UPDATE_CATEGORY } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { asyncResponseToaster } from '@/lib/toasts'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserPen } from 'lucide-react'

function AddEditItemModal({ modalState, data, setData }) {
  const queryClient = useQueryClient()

  const addCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_CATEGORY, method: METHODS.POST, data }),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_CATEGORY, method: METHODS.PUT, data }),
  })

  const { Field, handleSubmit, Subscribe, reset, store, resetField } = useForm({
    onSubmit,
    defaultValues: data,
  })

  const category_id = useStore(store, state => state.values.category_id)

  const categoriesOption = queryClient.ensureQueryData(getCategoriesOption({ paginate: false }))

  const subCategoriesOption = category_id ? queryClient.ensureQueryData(getSubCategoriesOption({ category_id })) : []

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
      <DialogContent className="sm:max-w-2xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 bg-bg-1 rounded-t-xl shadow">
          <DialogTitle className="text-center text-xl font-bold">
            {data ? 'Update' : 'Add'}
            &nbsp;
            Item
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
          <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-6">
            <Field
              name="category_id"
              listeners={{
                onChange: () => resetField('scm_id'),
              }}
              children={field => (
                <ControlledSearchableSelect
                  label="Select category"
                  field={field}
                  prefix={<UserPen className="size-5" />}
                  options={categoriesOption}
                  searchPlaceholder="Search category"
                  prepareOption={data => data.map(data => ({ value: data.category_id, label: data.name }))}
                  updateTriggerer={field.state.value}
                />
              )}
            />
            <Field
              name="scm_id"
              children={field => (
                <Subscribe
                  selector={state => state.values.category_id}
                  children={(category_id) => {
                    return (
                      <ControlledSearchableSelect
                        label="Select subcategory"
                        field={field}
                        prefix={<UserPen className="size-5" />}
                        options={subCategoriesOption}
                        searchPlaceholder="Search subcategory"
                        disabled={!category_id}
                        prepareOption={data => data.map(data => ({ value: data.scm_id, label: data.name }))}
                        updateTriggerer={category_id}
                      />
                    )
                  }}
                />
              )}
            />
            <Field
              name="name"
              children={field => (
                <ControlledInput
                  id="name"
                  label="Item name"
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
                  label="Item name hindi"
                  field={field}
                  prefix={<UserPen className="size-5" />}
                />
              )}
            />
            <Field
              name="ingredient"
              children={field => (
                <ControlledTagInput
                  id="ingredient"
                  label="Add a ingredient"
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

export { AddEditItemModal }

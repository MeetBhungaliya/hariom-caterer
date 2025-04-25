import { getCategoryList } from '@/api/query-option'
import { getAllCrockeryOption, getCategoriesOption, getItemCrockeryOption, getSubCategoriesOption } from '@/api/select-options'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { ControlledTagInput } from '@/components/common/controlled-taginput'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { METHODS } from '@/constants/common'
import { ADD_CATEGORY, UPDATE_CATEGORY } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { asyncResponseToaster } from '@/lib/toasts'
import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { UserPen } from 'lucide-react'

export const Route = createFileRoute('/_protected/items/add')({
  component: RouteComponent,
})

function RouteComponent() {

  const queryClient = useQueryClient()

  const addCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_CATEGORY, method: METHODS.POST, data }),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_CATEGORY, method: METHODS.PUT, data }),
  })

  const { Field, handleSubmit, Subscribe, reset, store, resetField } = useForm({ onSubmit })

  const category_id = useStore(store, state => state.values.category_id)

  const categoriesOption = queryClient.ensureQueryData(getCategoriesOption())
  const crockeriesOption = queryClient.ensureQueryData(getAllCrockeryOption())

  const subCategoriesOption = category_id ? queryClient.ensureQueryData(getSubCategoriesOption({ category_id })) : []
  const itemCrockeryOption = category_id ? queryClient.ensureQueryData(getItemCrockeryOption({ category_id, item_id: null })) : []

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
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleSubmit()
        }}
        className='h-full flex flex-col justify-between'
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
                searchPlaceholder="Seach category"
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
                      searchPlaceholder="Seach subcategory"
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
                label="Add ingredient"
                field={field}
                prefix={<UserPen className="size-5" />}
              />
            )}
          />
          <Field
            name="crockery_list"
            children={field => (
              <ControlledTagInput
                id="crockery_list"
                label="Add crockery"
                field={field}
                prefix={<UserPen className="size-5" />}
              />
            )}
          />
        </div>
        <div>
          <Separator />
          <div className="px-6 py-4 gap-x-4 flex justify-end">
            <Button type="button" variant="secondary" className="py-2 text-base border border-transparent hover:border">
              Cancel
            </Button>
            <Subscribe
              selector={state => state.isDirty}
              children={isDirty => (
                <Button
                  type="submit"
                  className="py-2 text-base"
                  disabled={!isDirty || addCategoryMutation.isPending || updateCategoryMutation.isPending}
                >
                  Save
                </Button>
              )}
            />
          </div>
        </div>
      </form>
    </>
  )
}

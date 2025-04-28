import { getCategoryList } from '@/api/query-option'
import { getAllCrockeryOption, getCategoriesOption, getItemCrockeryOption, getSubCategoriesOption } from '@/api/select-options'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledImageuploader } from '@/components/common/controlled-imageuploader'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { ControlledTagInput } from '@/components/common/controlled-taginput'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { METHODS } from '@/constants/common'
import { ADD_CATEGORY, UPDATE_CATEGORY } from '@/constants/endpoints'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { asyncResponseToaster } from '@/lib/toasts'
import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ReceiptIndianRupee, UserPen, UtensilsCrossed } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export const Route = createFileRoute('/_protected/items/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const isLoading = useAuthStore(state => state.isLoading)
  const [isCrockeryLoading, setIsCrockeryLoading] = useState(false)
  const [crockeryData, setCrockeryData] = useState([])
  const [itemCrockeryData, setItemCrockeryData] = useState([])
  const queryClient = useQueryClient()

  const addCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: ADD_CATEGORY, method: METHODS.POST, data }),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: async data => fetchApi({ url: UPDATE_CATEGORY, method: METHODS.PUT, data }),
  })

  const { Field, handleSubmit, Subscribe, reset, store, resetField } = useForm({ onSubmit })

  const category_id = useStore(store, state => state.values.category_id)

  const categoriesOption = queryClient.ensureQueryData(getCategoriesOption({ paginate: false }))
  const crockeriesOption = queryClient.ensureQueryData(getAllCrockeryOption({ paginate: false }))

  const subCategoriesOption = typeof category_id === "number" ? queryClient.ensureQueryData(getSubCategoriesOption({ category_id })) : []
  const itemCrockeryOption = typeof category_id === "number" ? queryClient.ensureQueryData(getItemCrockeryOption({ category_id })) : []

  useEffect(() => {
    if (!itemCrockeryOption.then) return

    itemCrockeryOption
      .then(res => {
        setIsCrockeryLoading(true)
        if (res.ResponseCode !== 1) return
        setCrockeryData(res.result.list)
      })
      .finally(() => {
        setIsCrockeryLoading(false)
      })

    if (!categoriesOption.then) return

    categoriesOption
      .then(res => {
        if (res.ResponseCode !== 1) return
        setItemCrockeryData(res.result.list)
      })

  }, [category_id])

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

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'name',
      size: 200,
    },
    {
      header: 'Name Hindi',
      accessorKey: 'name_hi',
      size: 200,
    },
    {
      header: 'Person',
      accessorKey: 'person',
      size: 200,
    },
    {
      header: 'Type',
      id: 'type',
      cell: (props) => {
        const category_id = props.row.original.category_id
        const category_name = itemCrockeryData.find(data => data.category_id === category_id)?.name
        return category_name
      },
      size: 200,
    },
  ], [JSON.stringify(itemCrockeryData)])

  return (
    <>
      <div className='h-full flex flex-col gap-y-6 overflow-hidden'>
        <div className='h-full flex flex-col gap-y-6 overflow-hidden'>
          <div className='h-full px-1 bg-white rounded-xl overflow-hidden'>
            <ScrollArea className='h-full py-6 px-5 flex flex-col overflow-hidden'>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSubmit()
                }}
                className='h-full flex flex-col gap-y-6'
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
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
                </div>
                <div className='grid grid-cols-2 gap-x-4'>
                  <div className='flex flex-col gap-y-6'>
                    <Field
                      name="price"
                      children={field => (
                        <ControlledInput
                          type='number'
                          label="Price"
                          field={field}
                          prefix={<ReceiptIndianRupee className="size-5" />}
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
                      name="recipe"
                      children={field => (
                        <ControlledInput
                          label="Recipe"
                          field={field}
                          textarea={true}
                        />
                      )}
                    />
                  </div>
                  <Field
                    name="image"
                    children={field => (
                      <ControlledImageuploader
                        id="image"
                        field={field}
                      />

                    )}
                  />

                </div>
              </form>
            </ScrollArea>
          </div>
          <Table
            columns={columns}
            data={crockeryData}
            pagination={false}
            isLoading={isLoading || isCrockeryLoading}
          />
        </div>
        <div>
          <Separator />
          <div className='pt-4 flex justify-between gap-x-4'>
          <IconButton icon={<UtensilsCrossed className="size-5" />} label="Add Crockery" />
          <div className="space-x-4">
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
        </div>
      </div>
    </>
  )
}

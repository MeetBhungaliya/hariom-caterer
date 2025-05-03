import { getItemList } from '@/api/query-option'
import { getAllCrockeryOption, getCategoriesOption, getItemCrockeryOption, getSubCategoriesOption } from '@/api/select-options'
import { IconButton } from '@/components/common/btn-with-icon'
import { ControlledImageuploader } from '@/components/common/controlled-imageuploader'
import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { ControlledTagInput } from '@/components/common/controlled-taginput'
import { Table } from '@/components/common/table'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { METHODS, pagination } from '@/constants/common'
import { ADD_ITEM, UPDATE_ITEM } from '@/constants/endpoints'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { addEditItemSchema } from '@/lib/schema'
import { asyncResponseToaster } from '@/lib/toasts'
import AddEditItemCrockery from '@/modals/item-crockery'
import { useForm, useStore } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useCanGoBack, useRouter, useRouterState } from '@tanstack/react-router'
import { toFormData } from 'axios'
import { ReceiptIndianRupee, UserPen, UtensilsCrossed } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import { Route as ItemsRoute } from './index'

export const Route = createFileRoute('/_protected/items/$item_id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { location } = useRouterState()

  const router = useRouter()
  const canGoBack = useCanGoBack()

  const queryClient = useQueryClient()
  const inputContainerRef = useRef()
  const isLoading = useAuthStore(state => state.isLoading)

  const itemCrockeryModal = useBoolean(false)
  const [updateItemCrockery, setUpdateItemCrockery] = useState([])

  const [isCrockeryLoading, setIsCrockeryLoading] = useState(false)
  const [crockeryData, setCrockeryData] = useState([])
  const [itemCrockeryData, setItemCrockeryData] = useState([])

  const updateItemMutation = useMutation({
    mutationFn: async data => fetchApi({ url: `${UPDATE_ITEM}?_method=${METHODS.PUT}`, method: METHODS.POST, data }),
  })

  const { Field, handleSubmit, Subscribe, reset, store, setFieldValue } = useForm({
    onSubmit,
    defaultValues: location.state,
    validators: { onSubmit: addEditItemSchema }
  })

  const category_id = useStore(store, state => state.values.category_id)

  const categoriesOption = queryClient.ensureQueryData(getCategoriesOption({ paginate: false }))

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

    if (!(value.image instanceof File)) {
      delete value.image
    }

    let crockery_list = []

    crockeryData.forEach(data => crockery_list.push({ crockery_id: data.crockery_id, add_to_category: false }))

    updateItemCrockery.forEach(data => crockery_list.push({ crockery_id: data.crockery_id, add_to_category: false }))

    value.crockery_list = JSON.stringify(crockery_list)

    const formData = toFormData(value)

    const result = await asyncResponseToaster(() => updateItemMutation.mutateAsync(formData))

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getItemList)
      onClose()
    }
  }

  function onClose() {
    setTimeout(() => {
      if (canGoBack) {
        router.history.back()
      } else {
        router.navigate({ to: ItemsRoute.fullPath, search: pagination })
      }
      reset({
        category_id: undefined,
        scm_id: undefined,
        name: undefined,
        name_hi: undefined,
        price: undefined,
        ingredient: undefined,
        recipe: undefined,
        image: undefined
      })
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

  const isNewCrockeryAdded = useCallback(
    () => {
      const crockery_list = new Set()

      crockeryData.forEach(data => crockery_list.add(data.crockery_id))
      updateItemCrockery.forEach(data => crockery_list.add(data.crockery_id))

      let isNew = false

      crockery_list.forEach(id => {
        if (!crockeryData.length) {
          isNew = true
        } else {
          crockeryData.forEach(crockery => {
            if (crockery.crockery_id !== id) {
              isNew = true
            }
          })
        }
      }
      )

      return isNew
    },
    [JSON.stringify([...crockeryData, ...updateItemCrockery])],
  )

  useEffect(() => {
    isNewCrockeryAdded()
  }, [JSON.stringify([...crockeryData, ...updateItemCrockery])])

  return (
    <>
      <div className='h-full flex flex-col gap-y-6 overflow-hidden'>
        <div className="bg-white p-4 rounded-xl flex justify-end gap-x-4">
          <Subscribe
            selector={(state) => state.isDirty || isNewCrockeryAdded()}
            children={isDirty => (
              <Button
                type="button"
                className="w-full max-w-[160px] py-2 text-base bg-sky-600 text-white"
                disabled={!isDirty || updateItemMutation.isPending}
                onClick={handleSubmit}
              >
                Update
              </Button>
            )}
          />
          <Subscribe
            selector={state => state.values.category_id}
            children={(category_id) => {
              return (
                <IconButton
                  icon={<UtensilsCrossed className="size-5" />}
                  label="Add Crockery"
                  onClick={itemCrockeryModal.setTrue}
                  disabled={typeof category_id !== 'number'}
                />
              )
            }}
          />

        </div>
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
                      onChange: () => setFieldValue('scm_id', undefined),
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
                </div>
                <div className='grid grid-cols-2 gap-x-4'>
                  <div ref={inputContainerRef} className='h-max flex flex-col gap-y-6'>
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
                        baseHeightElement={inputContainerRef}
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
            data={[...crockeryData, ...updateItemCrockery]}
            pagination={false}
            isLoading={isLoading || isCrockeryLoading}
          />
        </div>
      </div>

      <AddEditItemCrockery modalState={itemCrockeryModal} data={updateItemCrockery} setData={setUpdateItemCrockery} filterCrockeryData={[...crockeryData, ...updateItemCrockery]} />
    </>
  )
}

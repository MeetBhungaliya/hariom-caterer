import { getListOfItemOfPackage } from '@/api/select-options'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'

const CoastingItem = ({ index, item, Field, setFieldValue, getFieldValue, Subscribe, showPrice = false }) => {
  const queryClient = useQueryClient()

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    queryClient.ensureQueryData(getListOfItemOfPackage({ pim_id: item.pim_id }))
      .then(data => {
        if (item.pim_id) {
          setOptions((data.result.list[0]?.item ?? []).map(data => ({ value: data.item_id, label: data.name, name: item.name, pim_id: item.pim_id, price: data.price })))
        } else {
          const options = []
          const groupedOptions = new Map()
          data.result.list.forEach(items => {
            items.item.forEach(data => {
              groupedOptions.set(items.name,
                [...(groupedOptions.get(items.name) ?? []),
                { value: data.item_id, label: data.name, name: item.name, pim_id: item.pim_id, price: data.price }]
              )
              options.push({ value: data.item_id, label: data.name, name: item.name, pim_id: item.pim_id, price: data.price })
            })
          })
          setOptions(options)
        }
      }).finally(() => {
        setIsLoading(false)
      })
  }, [item.pim_id]);

  const handleAddItem = () => {
    const cloneItem = { ...item, deleteAble: true }

    if (cloneItem.item_id) {
      delete cloneItem.item_id
      delete cloneItem.oim_id
      delete cloneItem.price
    }

    const previousItem = getFieldValue("item")
    const addItemIndex = index + 1
    previousItem.splice(addItemIndex, 0, cloneItem);
    setFieldValue("item", previousItem);
  }

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='px-2 flex items-center justify-between'>
        <Label htmlFor={`item[${index}].item_id`} className='text-sm md:text-base font-medium'>
          {item.name}
        </Label>
        <Button type='button' variant='outline' className='p-1.5 bg-sky-600 rounded-sm border-transparent text-white hover:text-sky-600'
          onClick={handleAddItem}>
          <Plus className='size-4 stroke-3' />
        </Button>
      </div>
      <Field
        name={`item[${index}].item_id`}
        listeners={{
          onChange: (e) => {
            const selectedItem = options.find(item => item.value === e.value)
            const previousItem = getFieldValue("item")
            const itemWithPrice = previousItem.map(item => item.item_id === e.value ? { ...item, price: selectedItem?.price } : item)
            setFieldValue('item', itemWithPrice)
          }
        }}

        children={field => {
          const error = field.state.meta.errors?.[0]?.message
          return (
            <div className={cn('w-full flex border rounded-lg',
              error ? "border-red-500" : "border-border-1"
            )}>
              <ControlledSearchableSelect
                id={`item[${index}].item_id`}
                label={`Select ${item.name.toLowerCase()}`}
                field={field}
                prefix={false}
                icon={false}
                options={options}
                isLoading={isLoading}
                searchPlaceholder="Search item"
                updateTriggerer={isLoading}
                containerClassName='flex-1 border-none shadow-none'
              />
              <Subscribe
                selector={state => state.values.item}
                children={() => {
                  const item = (options || []).find(item => item.value === field.state.value)
                  return item?.price
                    ? <div className={cn("px-3 border-l flex items-center transition-opacity", showPrice.value ? "opacity-0" : "opacity-full")}>
                      <span className='text-sm md:text-base font-medium'>
                        {item?.price}
                      </span>
                    </div>
                    : null
                }}
              />
              <Field
                name='item'
                mode='array'
                children={(field) => {
                  const deleteAble = field.state.value.find((_, i) => i === index)?.deleteAble
                  return (
                    <Button type='button'
                      className={cn('px-3 border-0 border-l rounded-l-none hover:bg-red-500 hover:border-red-500',
                        error?.length ? "border-red-500" : "border-border-1"
                      )}
                      onClick={() => field.removeValue(index)}
                      disabled={!deleteAble}
                    >
                      <Trash2 className='size-5' />
                    </Button>
                  )
                }}
              />
            </div>
          )
        }}
      />
    </div>
  )
}

export { CoastingItem }


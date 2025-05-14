import { getListOfItemOfPackage } from '@/api/select-options'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { cn } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'

const CoastingItem = ({ index, item, Field, setFieldValue, getFieldValue, validateAllFields }) => {
  const queryClient = useQueryClient()

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    queryClient.ensureQueryData(getListOfItemOfPackage({ pim_id: item.pim_id }))
      .then(data => {
        setOptions((data.result.list[0]?.item ?? []).map(data => ({ value: data.item_id, label: data.name, pim_id: item.pim_id })))
      }).finally(() => {
        setIsLoading(false)
      })
  }, [item.pim_id]);

  const handleAddItem = () => {
    const previousItem = getFieldValue("item")
    const addItemIndex = index + 1
    previousItem.splice(addItemIndex, 0, { ...item, deleteAble: true });
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
                updateTriggerer={field.state.value || isLoading || JSON.stringify(options)}
                containerClassName='flex-1 border-none shadow-none'
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


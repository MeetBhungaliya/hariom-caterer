import { getListOfItemOfPackage } from '@/api/select-options'
import { ControlledSearchableSelect } from '@/components/common/controlled-searchable-select'
import { cn } from '@/lib/utils'
import { useStore } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Badge } from './ui/badge'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

const CoastingItem = ({ item, Field, setFieldValue, getFieldValue, Subscribe, showPrice, store }) => {
  const queryClient = useQueryClient()

  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const submissionAttempts = useStore(store, state => state.submissionAttempts)

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

  const getGroupedItems = useMemo(() => {
    const allItems = getFieldValue("item")
    return allItems.filter(i => i.pim_id === item.pim_id)
  }, [isLoading, item])

  const selectedItems = useMemo(() => {
    const items = getGroupedItems.map(e => options.find(a => a.value === e.item_id)).filter(b => b)
    return { items: items.map(a => a?.label), price: items.reduce((acc, curr) => acc += curr.price, 0) }
  }, [isLoading, item])

  const handleAddItem = () => {
    const cloneItem = { ...item, deleteAble: true }

    if (cloneItem.item_id) {
      delete cloneItem.item_id
      delete cloneItem.oim_id
      delete cloneItem.price
    }

    const previousItem = getFieldValue("item")
    const addItemIndex = item.index + 1
    previousItem.splice(addItemIndex, 0, cloneItem);
    setFieldValue("item", previousItem);
  }

  return (
    <div className='flex flex-col gap-y-2'>
      <div className='px-2 flex items-center justify-between'>
        <Label className='text-sm md:text-base font-medium'>
          {item.name}
        </Label>
        <div className='flex gap-x-4 items-center'>
          <span>
            {getGroupedItems.filter(e => e.item_id).length}
            &nbsp;
            of
            &nbsp;
            {getGroupedItems.length}
          </span>
          <Button
            type='button'
            variant='outline'
            className='p-1.5 bg-sky-600 rounded-sm border-transparent text-white hover:text-sky-600'
            onClick={handleAddItem}
          >
            <Plus className='size-4 stroke-3' />
          </Button>
        </div>
      </div>
      <Popover>
        <div className={cn('flex border rounded-lg',
          submissionAttempts
            ? getGroupedItems.some(i => !i.item_id) ? "border-red-500" : "border-border-1"
            : "border-border-1")}
        >
          <div className="px-4 border-r flex items-center">
            <span className='text-sm md:text-base font-medium'>
              {item?.count}
            </span>
          </div>
          <PopoverTrigger className="w-full font-medium text-start text-sm md:text-base ml-0 text-gray-500 cursor-pointer flex justify-between overflow-hidden">
            <div className='overflow-hidden'>
              {selectedItems.items.length
                ? <ScrollArea className="w-full px-2 py-2.5">
                  <div className='flex gap-x-2'>
                    {selectedItems.items.map((l, i) => {
                      return <Badge key={i} variant="outline">{l}</Badge>
                    })}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                : <p className='py-2.5 pl-2'>Select {item.name}</p>
              }
            </div>
            {selectedItems?.price
              ? <div className={cn("px-3 border-l border-border-1 flex items-center transition-opacity", showPrice.value ? "opacity-full" : "opacity-0")}>
                <span className='text-sm md:text-base font-medium'>
                  {selectedItems?.price}
                </span>
              </div>
              : null}
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          {getGroupedItems.map((item, index) => {
            return (
              <Field
                key={index}
                name={`item[${item.index}].item_id`}
                listeners={{
                  onChange: (e) => {
                    const selectedItem = options.find(item => item.value === e.value)
                    const previousItem = getFieldValue("item")
                    const itemWithPrice = previousItem.map(item => item.item_id === e.value ? { ...item, price: selectedItem?.price } : item)
                    setFieldValue('item', itemWithPrice)
                  }
                }}
                children={field => {
                  return (
                    <div className='flex justify-between border-b last:border-b-0'>
                      <ControlledSearchableSelect
                        id={`item[${item.index}].item_id`}
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
                      <div className='flex'>
                        <Subscribe
                          selector={state => state.values.item}
                          children={() => {
                            const item = (options || []).find(item => item.value === field.state.value)
                            return item?.price
                              ? <div className={cn("px-3 border-l border-border-1 flex items-center transition-opacity", showPrice.value ? "opacity-100" : "opacity-0")}>
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
                            const deleteAble = field.state.value.find((_, i) => i === item.index)?.deleteAble
                            return (
                              <Button type='button'
                                className='px-3 border-0 border-l border-border-1 rounded-l-none hover:bg-red-500 hover:border-red-500'
                                onClick={() => field.removeValue(item.index)}
                                disabled={!deleteAble}
                              >
                                <Trash2 className='size-5' />
                              </Button>
                            )
                          }}
                        />
                      </div>
                    </div>
                  )
                }}
              />
            )
          })}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { CoastingItem }


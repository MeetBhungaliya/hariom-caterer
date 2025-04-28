import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, tryCatch } from '@/lib/utils'
import { Check, ChevronDown } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'

function ControlledSearchableSelectBase({ label, prefix, field, searchPlaceholder, disabled, options }) {
  const optionsState = useBoolean()
  // const errorMsg = field.state.meta.errors?.[0]?.message

  // let options = []

  // if (props.options.then && typeof props.options.then === 'function') {
  //   const result = use(props.options)
  //   if (Array.isArray(result.result.list)) {
  //     options = result.result.list.map(data => ({ value: data.category_id, label: data.name }))
  //   }
  // }

  return (
    <Popover open={optionsState.value} onOpenChange={optionsState.setValue}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full p-3 border !border-input justify-start rounded-lg relative hover:bg-transparent',
            optionsState.value ? 'border-sky-600' : 'border-border',
          )}
          disabled={disabled}
        >
          {prefix && (
            <div
              className={cn(
                'h-full absolute left-0 top-0',
                'aspect-square flex items-center justify-center',
                'rounded-l-lg bg-sky-100/80 backdrop-blur-sm',
                'text-sky-600 dark:text-sky-400',
              )}
            >
              {prefix}
            </div>
          )}

          <span className="ml-[3rem] text-sm md:text-base text-gray-500 dark:text-gray-400">
            {field.state.value
              ? options.find(option => option.value === field.state.value)?.label
              : label}
          </span>

          <div
            className={cn(
              'h-[calc(100%-2px)] absolute right-0 top-[1px] transition-colors',
              'aspect-square flex items-center justify-center',
              'rounded-r-lg bg-transparent backdrop-blur-sm',
              optionsState.value ? 'text-sky-600' : 'text-gray-500',
            )}
          >
            <ChevronDown className="size-5" />
          </div>

        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No value found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    field.handleChange(option.value === field.state.value ? '' : option.value)
                    optionsState.setFalse()
                  }}
                  className={cn(field.state.value === option.value ? 'bg-sky-200 data-[selected=true]:bg-sky-200' : 'bg-transparent')}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      field.state.value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function ControlledSearchableSelect(props) {
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState()

  const getOptions = useCallback(
    async () => {
      try {
        setIsLoading(true)
        if (props.options.then && typeof props.options.then === 'function') {
          const result = await tryCatch(() => props.options)
          if (result.success && result.value) {
            if (Array.isArray(result.value.result.list)) {
              setOptions(props.prepareOption(result.value.result.list))
            }
          }
        }
      }
      catch (error) {
        console.log(error)
      }
      finally {
        setIsLoading(false)
      }
    },
    [props.updateTriggerer],
  )

  useEffect(() => {
    getOptions()
  }, [props.updateTriggerer])

  if (isLoading)
    return <Skeleton className="h-[50px]" />

  return (
    <ControlledSearchableSelectBase {...props} options={options} />
  )
}

export { ControlledSearchableSelect }

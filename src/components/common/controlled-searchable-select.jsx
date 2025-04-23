import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronDown } from 'lucide-react'
import { useBoolean } from 'usehooks-ts'
import { Button } from '../ui/button'

function ControlledSearchableSelect({ prefix, field, options }) {
  const optionsState = useBoolean()
  // const errorMsg = field.state.meta.errors?.[0]?.message

  return (
    <Popover open={optionsState.value} onOpenChange={optionsState.setValue}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full border border-border justify-start rounded-lg !p-0 relative hover:bg-transparent"
        >
          {prefix && (
            <div
              className={cn(
                'p-3.5',
                'aspect-square flex items-center justify-center',
                'rounded-l-lg bg-sky-100/80 backdrop-blur-sm',
                'text-sky-600 dark:text-sky-400',
              )}
            >
              {prefix}
            </div>
          )}
          <div className="w-full flex justify-between items-center">
            <span className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              {field.state.value
                ? options.find(value => value.value === value)?.label
                : 'Select value...'}
            </span>
            <div
              className={cn(
                'p-3.5',
                'aspect-square flex items-center justify-center',
                'rounded-r-lg bg-sky-100/80 backdrop-blur-sm',
                'text-sky-600 dark:text-sky-400',
              )}
            >
              <ChevronDown className="size-5" />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search value..." />
          <CommandList>
            <CommandEmpty>No value found.</CommandEmpty>
            <CommandGroup>
              {options.map(value => (
                <CommandItem
                  key={value.value}
                  value={value.value}
                  onSelect={(currentValue) => {
                    field.handleChange(currentValue === value ? '' : currentValue)
                    optionsState.setFalse()
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === value.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {value.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { ControlledSearchableSelect }

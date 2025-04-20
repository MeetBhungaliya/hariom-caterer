import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

function ControlledInput({ id, label, className, prefix, field, type = 'text', ...props }) {
  const errorMsg = field.state.meta.errors?.[0]?.message

  return (
    <div className="relative w-full">
      {prefix && (
        <div
          className={cn(
            'h-[calc(100%-2px)] absolute left-[1px] top-[1px]',
            'aspect-square flex items-center justify-center',
            'rounded-l-lg bg-sky-100/80 backdrop-blur-sm',
            'text-sky-600 dark:text-sky-400',
          )}
        >
          {prefix}
        </div>
      )}
      <Input
        type={type}
        value={(field.state.value ?? undefined) ?? (type === 'number' ? '' : '')}
        onChange={e => field.handleChange(type === 'number' ? e.target.valueAsNumber : e.target.value)}
        onBlur={field.handleBlur}
        data-invalid={Boolean(errorMsg)}
        autoComplete="on"
        placeholder=" "
        className={cn(
          'peer w-full py-3 px-4 rounded-lg',
          'text-sm md:text-base font-medium',
          'border-gray-300 hover:border-sky-300',
          'focus:border-sky-500 focus:ring-1 focus:ring-sky-200',
          'dark:border-gray-600 dark:hover:border-sky-500',
          'dark:focus:border-sky-400 dark:focus:ring-sky-800',
          'data-[invalid=true]:text-red-500 data-[invalid=true]:border-red-400 data-[invalid=true]:ring-red-200',
          'transition-colors duration-200',
          prefix && 'pl-[3.5rem]',
          className,
        )}
        id={id}
        {...props}
      />
      <Label
        htmlFor={id}
        className={cn(
          'absolute z-10 px-2',
          'text-sm md:text-base text-gray-500 dark:text-gray-400',
          'bg-background dark:bg-gray-900',
          'origin-[0] transform transition-all duration-200',
          'top-1 -translate-y-4 scale-85',
          'peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75',
          'peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75',
          'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
          'peer-data-[invalid=true]:text-red-500',
          'rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
          prefix ? 'left-13' : 'left-3',
          'cursor-text',
        )}
      >
        {label}
      </Label>
    </div>
  )
}

export { ControlledInput }

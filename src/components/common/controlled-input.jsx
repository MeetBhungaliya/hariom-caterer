import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'
import { useEventListener } from 'usehooks-ts'
import { useRef } from 'react'

function ControlledInput({ id, label,containerClassName, className, prefix, field, type = 'text', textarea, ...props }) {
  const errorMsg = field.state.meta.errors?.[0]?.message

  const inputRef = useRef()

  useEventListener(
    'wheel',
    (e) => {
      if (type === 'number') return e.preventDefault()
    },
    inputRef
  )

  if (textarea) {
    return (
      <div className="relative w-full">
        <Textarea
          id={id}
          data-invalid={Boolean(errorMsg)}
          placeholder=" "
          className={cn(
            'min-h-[100px] max-h-[200px] peer w-full py-3 px-4 rounded-lg',
            'text-sm md:text-base font-medium',
            'border-gray-300 hover:border-sky-600',
            'focus-visible:border-sky-600 focus-visible:ring-1 focus-visible:ring-sky-600',
            'dark:border-gray-600 dark:hover:border-sky-600',
            'dark:focus:border-sky-600 dark:focus:ring-sky-800',
            'data-[invalid=true]:text-red-500 data-[invalid=true]:border-red-400 data-[invalid=true]:ring-red-200',
            'transition-colors duration-200',
            className,
          )}
          value={field.state.value ?? undefined}
          onChange={e => field.handleChange(e.target.value)}
        />
        <Label
          htmlFor={id}
          className={cn(
            'absolute z-10 px-2 left-3',
            'text-sm md:text-base text-gray-500 dark:text-gray-400',
            'bg-background dark:bg-gray-900',
            'origin-[0] transform transition-all duration-200',
            'top-1 -translate-y-4 scale-85',
            'peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75',
            'peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:-translate-y-4 peer-not-placeholder-shown:scale-75',
            'peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100',
            'peer-data-[invalid=true]:text-red-500',
            'rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
            'cursor-text',
          )}
        >
          {label}
        </Label>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full", containerClassName)}>
      {prefix && (
        <div
          className={cn(
            'h-full absolute left-0 top-0',
            'aspect-square flex items-center justify-center',
            'rounded-l-[10px] bg-sky-600 backdrop-blur-sm',
            'text-white dark:text-white',
          )}
        >
          {prefix}
        </div>
      )}
      <Input
        ref={inputRef}
        onKeyPress={(e) => {
          if (type !== 'number') return
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault()
          }
        }}
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
          'border-gray-300 hover:border-sky-600',
          'focus:border-sky-600 focus:ring-1 focus:ring-sky-600',
          'dark:border-gray-600 dark:hover:border-sky-600',
          'dark:focus:border-sky-600 dark:focus:ring-sky-800',
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

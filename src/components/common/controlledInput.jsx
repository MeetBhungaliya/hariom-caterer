import React from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'

export const ControlledInput = ({ id, label, className, ...props }) => {
  return (
    <div className="relative">
      <Input
        id={id}
        className={cn('peer', className)}
        {...props}
      />
      <Label
        htmlFor={id}
        className={cn(
          'peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 cursor-text'
        )}
      >
        {label}
      </Label>
    </div>
  )
}


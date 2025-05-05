import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

function IconButton({ label, icon, className, iconend = false, ...props }) {
  return (
    <Button
      className={cn("p-0 border border-sky-600 relative group overflow-hidden rounded-lg bg-white hover:bg-transparent text-text-1 cursor-pointer inline-flex items-center",
        iconend ? "pl-3" : "pr-3",
        className)}
      {...props}
    >
      <span
        className={cn("absolute inset-0 bg-sky-600 z-0 transform transition-transform duration-300 group-hover:translate-x-0",
          iconend ? "translate-x-full" : "-translate-x-full"
        )}
      />
      <div className="relative z-10 h-full flex gap-x-2 items-center font-semibold">
        {!iconend
          && <div className="h-full p-3 bg-sky-600 grid place-items-center text-white">
            {icon}
          </div>
        }
        <span
          className="
            inline-block truncate
            whitespace-nowrap overflow-hidden text-ellipsis
            transition-colors duration-200 group-hover:text-white
          "
        >
          {label}
        </span>
        {iconend
          && <div className="h-full p-3 bg-sky-600 grid place-items-center text-white">
            {icon}
          </div>
        }
      </div>
    </Button>
  )
}

export { IconButton }


import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarDaysIcon } from "lucide-react"
import { useState } from "react"

const ControlledDatepicker = ({ label, field, extendContent }) => {
  const errorMsg = field.state.meta.errors?.[0]?.message

  const [date, setDate] = useState()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          data-invalid={Boolean(errorMsg)}
          className={cn(
            'w-full p-0 border !border-gray-300 justify-start rounded-lg relative text-base hover:bg-transparent',
            date ? 'text-text-1 border-sky-600 hover:text-text-1' : 'text-gray-500 border-border hover:text-gray-500',
            'data-[invalid=true]:!text-red-500 data-[invalid=true]:!border-red-400 data-[invalid=true]:!ring-red-200',
          )}
        >
          <div className="h-full aspect-square bg-sky-600 flex items-center justify-center rounded-l-lg">
            <CalendarDaysIcon className="text-white size-5" />
          </div>
          {date ? format(date, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        {extendContent}
      </PopoverContent>
    </Popover>
  )
}

export default ControlledDatepicker
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, isBefore, startOfDay } from "date-fns"
import { CalendarDaysIcon } from "lucide-react"
import { useState } from "react"

const ControlledDatepicker = ({
  label,
  field,
  extendContent,
  align="center",
  className,
}) => {
  const errorMsg = field.state.meta.errors?.[0]?.message;

  const [date, setDate] = useState(
    field.state.value ? new Date(field.state.value) : null
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          data-invalid={Boolean(errorMsg)}
          className={cn(
            "w-full p-0 gap-3 border !border-gray-300 justify-start rounded-lg relative text-sm md:text-base hover:bg-transparent",
            date
              ? "text-text-1 border-sky-600 hover:text-text-1"
              : "text-gray-500 border-border hover:text-gray-500",
            "data-[invalid=true]:!text-red-500 data-[invalid=true]:!border-red-400 data-[invalid=true]:!ring-red-200"
          )}
        >
          <div className="h-full aspect-square bg-sky-600 flex items-center justify-center rounded-l-lg">
            <CalendarDaysIcon className="text-white size-5" />
          </div>
          {date ? format(date, "PPP") : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-[var(--radix-popover-trigger-width)] p-0", className)}
        align={align}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => {
            setDate(e);
            field.handleChange(e);
          }}
          disabled={(date) =>
            isBefore(startOfDay(date), startOfDay(new Date()))
          }
          initialFocus
        />
        {extendContent}
      </PopoverContent>
    </Popover>
  );
};

export default ControlledDatepicker
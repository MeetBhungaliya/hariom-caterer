import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function ControlledSelect({
  id,
  label,
  containerClassName,
  className,
  prefix,
  field,
  placeholder = "Select option",
  options = [],
  ...props
}) {
  const errorMsg = field.state.meta.errors?.[0]?.message;

  return (
    <div className={cn("relative w-full", containerClassName)}>
      {prefix && (
        <div
          className={cn(
            "h-[calc(100%-2px)] absolute top-[1px] left-0 hidden lg:flex",
            "aspect-square items-center justify-center",
            "rounded-l-[10px] bg-sky-600 backdrop-blur-sm",
            "text-white dark:text-white"
          )}
        >
          {prefix}
        </div>
      )}
      <Select
        value={field.state.value ?? undefined}
        defaultValue={field.state.value ?? undefined}
        onValueChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        {...props}
      >
        <SelectTrigger
          id={id}
          data-invalid={Boolean(errorMsg)}
          className={cn(
            "peer w-full !h-[46px] px-3 rounded-lg",
            "text-xs sm:text-sm md:text-base font-medium",
            "border-gray-300 hover:border-sky-600",
            "dark:border-gray-600 dark:hover:border-sky-600",
            "dark:focus:border-sky-600 dark:focus:ring-sky-800",
            "data-[invalid=true]:text-red-500 data-[invalid=true]:border-red-400 data-[invalid=true]:ring-red-200",
            "transition-colors duration-200",
            prefix && "lg:pl-[3.5rem]",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((item, key) => (
            <SelectItem key={key} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label
        htmlFor={id}
        className={cn(
          "absolute z-10 px-2",
          "text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400",
          "bg-background dark:bg-gray-900",
          "origin-[0] transform transition-all duration-200",
          field.state.value
            ? "top-1 -translate-y-4 scale-85"
            : "top-1/2 -translate-y-1/2 scale-100",
          "peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75",
          "peer-data-[invalid=true]:text-red-500",
          prefix ? "lg:left-13 left-3" : "left-3",
          "cursor-text"
        )}
      >
        {label}
      </Label>
    </div>
  );
}

export { ControlledSelect };

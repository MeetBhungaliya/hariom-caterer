import { cn, tryCatch } from '@/lib/utils';
import { TagInput } from 'emblor';
import { useCallback, useEffect, useState } from 'react';

function ControlledTagInput({ id, label, className, prefix, field, enableAutocomplete = false, ...props }) {
  const [tags, setTags] = useState(field.state.value ? ((field.state.value).split(",").map((data, index) => ({ id: index, text: data.trim() })) ?? []) : []);
  const [activeTagIndex, setActiveTagIndex] = useState(null);

  const errorMsg = field.state.meta.errors?.[0]?.message

  const getOptions = useCallback(
    async () => {
      if (props.options?.then && typeof props.options.then === 'function') {
        const result = await tryCatch(() => props.options)
        if (result.success && result.value) {
          if (Array.isArray(result.value.result.list)) {
            setTags(props.prepareOption(result.value.result.list))
          }
        }
      }
    },
    [props.updateTriggerer],
  )

  useEffect(() => {
    getOptions()
  }, [props.updateTriggerer])

  return (
    <TagInput
      placeholder={label}
      tags={tags}
      setTags={(newTags) => {
        field.handleChange(newTags.map(tag => tag.text).join(", "))
        setTags(newTags);
      }}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      styleClasses={{
        autoComplete: {
          popoverContent: "-translate-x-2"
        },
        input: "h-full w-full min-w-[140px] max-w-[50%] px-0 md:py-1 focus-visible:outline-none text-xs sm:text-sm md:text-base text-text-1 placeholder:text-gray-500 font-medium shadow-none",
        inlineTagsContainer: cn("min-h-[41px] sm:min-h-[50px] max-h-[200px] px-4 overflow-y-auto rounded-[10px]",
          Boolean(errorMsg) ? "text-red-500 border-red-400 ring-red-200" : "border-gray-300",
        )
      }}
      animation='fadeIn'
      restrictTagsToAutocompleteOptions={enableAutocomplete}
      enableAutocomplete={enableAutocomplete}
      inlineTags
      showCount
    />
  )
}

export { ControlledTagInput };


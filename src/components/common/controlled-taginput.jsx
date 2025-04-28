import { tryCatch } from '@/lib/utils';
import { TagInput } from 'emblor';
import { useCallback, useEffect, useState } from 'react';

function ControlledTagInput({ id, label, className, prefix, field, enableAutocomplete = false, ...props }) {
  const [tags, setTags] = useState([]);
  const [activeTagIndex, setActiveTagIndex] = useState(null);

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
        setTags(newTags);
        field.handleChange(newTags)
      }}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      styleClasses={{
        autoComplete: {
          popoverContent: "-translate-x-2"
        },
        input: "h-full w-full min-w-[140px] max-w-[50%] px-0 py-1 focus-visible:outline-none text-sm md:text-base text-text-1 placeholder:text-gray-500 font-medium",
        inlineTagsContainer: `min-h-[50px] max-h-[200px] px-4 overflow-y-auto ${enableAutocomplete ? "rounded-lg" : "border !border-input"}`
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


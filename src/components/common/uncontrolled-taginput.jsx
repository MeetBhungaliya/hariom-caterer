import { cn } from "@/lib/utils";
import { TagInput } from "emblor";
import { useEffect, useState } from "react";

function UncontrolledTagInput({
  id,
  label,
  inputClassName,
  className,
  enableAutocomplete = false,
  value,
  onChange,
  ...props
}) {
  const [tags, setTags] = useState(
    (value ?? []).map((text, index) => ({ id: index, text: text.trim() }))
  );
  const [activeTagIndex, setActiveTagIndex] = useState(null);

  useEffect(() => {
    setTags(
      (value ?? []).map((text, index) => ({ id: index, text: text.trim() }))
    );
  }, [JSON.stringify(value)]);

  return (
    <TagInput
      id={id}
      placeholder={label}
      tags={tags}
      setTags={(newTags) => {
        setTags(newTags);
        onChange(newTags.map((tag) => tag.text));
      }}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      styleClasses={{
        autoComplete: {
          popoverContent: "-translate-x-2",
        },
        input: cn(
          "h-full w-full min-w-[140px] max-w-[50%] px-0 md:py-1 focus-visible:outline-none text-xs sm:text-sm md:text-base text-text-1 placeholder:text-gray-500 font-medium shadow-none",
          inputClassName
        ),
        inlineTagsContainer: cn(
          "min-h-[41px] sm:min-h-[50px] max-h-[200px] px-4 overflow-y-auto rounded-[10px] border-gray-300",
          className
        ),
      }}
      animation="fadeIn"
      restrictTagsToAutocompleteOptions={enableAutocomplete}
      enableAutocomplete={enableAutocomplete}
      inlineTags
      showCount
      {...props}
    />
  );
}

export { UncontrolledTagInput };

import { TagInput } from 'emblor';
import { useState } from 'react';

function ControlledTagInput({ id, label, className, prefix, field, }) {
  const [tags, setTags] = useState([]);
  const [activeTagIndex, setActiveTagIndex] = useState(null);

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
        input: "h-full w-full min-w-[140px] px-0 py-1 focus-visible:outline-none text-sm md:text-base text-text-1 placeholder:text-gray-500 font-medium",
        inlineTagsContainer: "min-h-[50px] max-h-[200px] px-3 overflow-y-auto"
      }}
      animation='fadeIn'
      inlineTags
      showCount
    />
  )
}

export { ControlledTagInput };


import { Command as CommandPrimitive, useCommandState } from 'cmdk';
import { X } from 'lucide-react';
import * as React from 'react';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useDebounceValue } from 'usehooks-ts';

function transToGroupOption(options, groupBy) {
  if (options.length === 0) return {};
  if (!groupBy) return { '': options };

  const groupOption = {};
  options.forEach((option) => {
    const key = option[groupBy] || '';
    if (!groupOption[key]) groupOption[key] = [];
    groupOption[key].push(option);
  });
  return groupOption;
}

function removePickedOption(groupOption, picked) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption));
  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter((val) => !picked.find((p) => p.value === val.value));
  }
  return cloneOption;
}

function isOptionsExist(groupOption, targetOption) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetOption.find((p) => p.value === option.value))) {
      return true;
    }
  }
  return false;
}

const CommandEmpty = forwardRef(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);
  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn('py-6 text-center text-sm', className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});
CommandEmpty.displayName = 'CommandEmpty';

const ControlledMultipleSelector = forwardRef((props, ref) => {
  const {
    value,
    onChange,
    label,
    defaultOptions = [],
    options: arrayOptions,
    delay,
    onSearch,
    onSearchSync,
    loadingIndicator,
    emptyIndicator,
    maxSelected = Number.MAX_SAFE_INTEGER,
    onMaxSelected,
    hidePlaceholderWhenSelected,
    disabled,
    groupBy,
    className,
    badgeClassName,
    selectFirstItem = true,
    creatable = false,
    triggerSearchOnFocus = false,
    commandProps = {},
    inputProps = {},
    hideClearAllButton = false,
    loading,
    removeAll
  } = props;

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [onScrollbar, setOnScrollbar] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);
  const [selected, setSelected] = useState(value || []);
  const [options, setOptions] = useState(transToGroupOption(defaultOptions, groupBy));
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounceValue(inputValue, delay || 500);

  useImperativeHandle(ref, () => ({
    selectedValue: [...selected],
    input: inputRef.current,
    focus: () => inputRef?.current?.focus(),
    reset: () => setSelected([]),
  }), [selected]);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      inputRef.current &&
      !inputRef.current.contains(event.target)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  };

  const handleUnselect = useCallback((option) => {
    const newOptions = selected.filter((s) => s.value !== option.value);
    setSelected(newOptions);
    onChange?.(newOptions);
  }, [onChange, selected]);

  const handleKeyDown = useCallback((e) => {
    const input = inputRef.current;
    if (!input) return;

    if ((e.key === 'Delete' || e.key === 'Backspace') && input.value === '' && selected.length > 0) {
      const lastOption = selected[selected.length - 1];
      if (!lastOption.fixed) {
        handleUnselect(lastOption);
      }
    }
    if (e.key === 'Escape') input.blur();
  }, [handleUnselect, selected]);

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchend', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  useEffect(() => {
    if (!arrayOptions || onSearch) return;
    const newOption = transToGroupOption(arrayOptions || [], groupBy);
    if (JSON.stringify(newOption) !== JSON.stringify(options)) {
      setOptions(newOption);
    }
  }, [arrayOptions, defaultOptions, groupBy, onSearch, options]);

  useEffect(() => {
    const doSearchSync = () => {
      const res = onSearchSync?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
    };

    const exec = async () => {
      if (!onSearchSync || !open) return;
      if (triggerSearchOnFocus) doSearchSync();
      if (debouncedSearchTerm) doSearchSync();
    };
    exec();
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  useEffect(() => {
    const doSearch = async () => {
      setIsLoading(true);
      const res = await onSearch?.(debouncedSearchTerm);
      setOptions(transToGroupOption(res || [], groupBy));
      setIsLoading(false);
    };

    const exec = async () => {
      if (!onSearch || !open) return;
      if (triggerSearchOnFocus) await doSearch();
      if (debouncedSearchTerm) await doSearch();
    };
    exec();
  }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

  const CreatableItem = () => {
    if (!creatable || isOptionsExist(options, [{ value: inputValue, label: inputValue }]) || selected.find((s) => s.value === inputValue)) {
      return null;
    }

    const Item = (
      <CommandItem
        value={inputValue}
        className="cursor-pointer"
        onMouseDown={(e) => e.preventDefault()}
        onSelect={(value) => {
          if (selected.length >= maxSelected) {
            onMaxSelected?.(selected.length);
            return;
          }
          setInputValue('');
          const newOptions = [...selected, { value, label: value }];
          setSelected(newOptions);
          onChange?.(newOptions);
        }}
      >
        {`Create "${inputValue}"`}
      </CommandItem>
    );

    if ((!onSearch && inputValue.length > 0) || (onSearch && debouncedSearchTerm.length > 0 && !isLoading)) {
      return Item;
    }

    return null;
  };

  const EmptyItem = useCallback(() => {
    if (!emptyIndicator) return null;
    if (onSearch && !creatable && Object.keys(options).length === 0) {
      return <CommandItem value="-" disabled>{emptyIndicator}</CommandItem>;
    }
    return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
  }, [creatable, emptyIndicator, onSearch, options]);

  const selectables = useMemo(() => removePickedOption(options, selected), [options, selected]);

  const commandFilter = useCallback(() => {
    if (commandProps.filter) return commandProps.filter;
    if (creatable) {
      return (value, search) => value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
    }
    return undefined;
  }, [creatable, commandProps.filter]);

  return (
    <Command
      ref={dropdownRef}
      {...commandProps}
      onKeyDown={(e) => {
        handleKeyDown(e);
        commandProps?.onKeyDown?.(e);
      }}
      className={cn('h-auto overflow-visible bg-transparent', commandProps?.className)}
      shouldFilter={commandProps?.shouldFilter !== undefined ? commandProps.shouldFilter : !onSearch}
      filter={commandFilter()}
    >
      <div
        className={cn(
          'rounded-lg border border-input text-base md:text-sm',
          { 'px-3 py-3': selected.length !== 0, 'cursor-text': !disabled && selected.length !== 0 },
          className
        )}
        onClick={() => !disabled && inputRef?.current?.focus()}
      >
        <div className="relative flex flex-wrap gap-1">
          {selected.map((option) => (
            <Badge
              key={option.value}
              className={cn(
                'data-[disabled]:bg-sky-600 data-[disabled]:text-muted data-[disabled]:hover:bg-sky-600',
                'data-[fixed]:bg-sky-600 data-[fixed]:text-muted data-[fixed]:hover:bg-sky-600',
                'rounded-sm bg-sky-600',
                badgeClassName
              )}
              data-fixed={option.fixed}
              data-disabled={disabled || undefined}
            >
              {option.label}
              <button
                type="button"
                className={cn(
                  'ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  (disabled || option.fixed) && 'hidden'
                )}
                onClick={() => handleUnselect(option)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <X className="h-3 w-3 text-sky600bg-sky-600 cursor-pointer" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            value={inputValue}
            disabled={disabled}
            onValueChange={(value) => {
              setInputValue(value);
              inputProps?.onValueChange?.(value);
            }}
            onBlur={(event) => {
              if (!onScrollbar) setOpen(false);
              inputProps?.onBlur?.(event);
            }}
            onFocus={(event) => {
              setOpen(true);
              inputProps?.onFocus?.(event);
            }}
            placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? '' : label}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder:text-sky600',
              'text-sm md:text-base font-medium',
              {
                'w-full': hidePlaceholderWhenSelected,
                'px-3 py-3': selected.length === 0,
                'ml-1': selected.length !== 0,
              },
              inputProps?.className
            )}
          />
          {removeAll && <button
            type="button"
            onClick={() => {
              const fixed = selected.filter((s) => s.fixed);
              setSelected(fixed);
              onChange?.(fixed);
            }}
            className={cn(
              'absolute right-0 h-6 w-6 p-0',
              (hideClearAllButton || disabled || selected.length < 1 || selected.every((s) => s.fixed)) && 'hidden'
            )}
          >
            <X />
          </button>}
        </div>
      </div>
      <div className="relative">
        {open && (
          <CommandList
            className="absolute top-1 z-10 w-full rounded-lg border bg-popover text-popover-foreground shadow-md outline-none animate-in"
            onMouseLeave={() => setOnScrollbar(false)}
            onMouseEnter={() => setOnScrollbar(true)}
            onMouseUp={() => inputRef?.current?.focus()}
          >
            {isLoading ? (
              <>{loadingIndicator}</>
            ) : (
              <>
                {EmptyItem()}
                {CreatableItem()}
                {!selectFirstItem && <CommandItem value="-" className="hidden" />}
                {Object.entries(selectables).map(([key, dropdowns]) => (
                  <CommandGroup key={key} heading={key} className="h-full overflow-auto">
                    <>
                      {dropdowns.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.label}
                          disabled={option.disable}
                          onMouseDown={(e) => e.preventDefault()}
                          onSelect={() => {
                            if (selected.length >= maxSelected) {
                              onMaxSelected?.(selected.length);
                              return;
                            }
                            setInputValue('');
                            const newOptions = [...selected, option];
                            setSelected(newOptions);
                            onChange?.(newOptions);
                          }}
                          className={cn(
                            'cursor-pointer',
                            option.disable && 'cursor-default text-sky600bg-sky-600'
                          )}
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </>
                  </CommandGroup>
                ))}
              </>
            )}
          </CommandList>
        )}
      </div>
    </Command>
  );
});

export { ControlledMultipleSelector }

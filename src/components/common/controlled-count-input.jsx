import NumberFlow from '@number-flow/react'
import clsx from 'clsx/lite'
import { Minus, Plus } from 'lucide-react'
import * as React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

function ControlledCountInput({ value = 0, min = -Infinity, max = Infinity, onChange }) {
  const defaultValue = React.useRef(value)
  const inputRef = React.useRef(null)
  const [animated, setAnimated] = React.useState(true)
  // Hide the caret during transitions so you can't see it shifting around:
  const [showCaret, setShowCaret] = React.useState(true)
  const handleInput = ({ currentTarget: el }) => {
    setAnimated(false)
    let next = value
    if (el.value === '') {
      next = defaultValue.current
    } else {
      const num = el.valueAsNumber
      if (!isNaN(num) && min <= num && num <= max) next = num
    }
    // Manually update the input.value in case the number stays the same e.g. 09 == 9
    el.value = String(next)
    onChange?.(next)
  }
  const handlePointerDown = (diff) => (event) => {
    setAnimated(true)
    if (event.pointerType === 'mouse') {
      event?.preventDefault()
      inputRef.current?.focus()
    }
    const newVal = Math.min(Math.max(value + diff, min), max)
    onChange?.(newVal)
  }
  return (
    <div className="w-full max-w-[100px] min-w-[100px] border-l flex justify-between items-stretch font-semibold">
      <Button
        aria-hidden="true"
        tabIndex={-1}
        className="rounded-none border-none shadow-none"
        disabled={min != null && value <= min}
        onPointerDown={handlePointerDown(-1)}
      >
        <Minus className="size-4" absoluteStrokeWidth strokeWidth={3.5} />
      </Button>
      <div className="relative font-normal text-text-2 grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
        <Input
          ref={inputRef}
          className={clsx(
            showCaret ? 'caret-primary' : 'caret-transparent',
            'p-0 bg-transparent text-center text-transparent outline-none border-none shadow-none selection:bg-transparent'
          )}
          // Make sure to disable kerning, to match NumberFlow:
          style={{ fontKerning: 'none' }}
          type="number"
          min={min}
          step={1}
          autoComplete="off"
          inputMode="numeric"
          max={max}
          value={value}
          onInput={handleInput}
        />
        <NumberFlow
          value={value}
          locales="en-US"
          format={{ useGrouping: false }}
          aria-hidden="true"
          animated={animated}
          onAnimationsStart={() => setShowCaret(false)}
          onAnimationsFinish={() => setShowCaret(true)}
          className="pointer-events-none"
          willChange
        />
      </div>
      <Button
        aria-hidden="true"
        tabIndex={-1}
        className="rounded-none border-none shadow-none"
        disabled={max != null && value >= max}
        onPointerDown={handlePointerDown(1)}
      >
        <Plus className="size-4" absoluteStrokeWidth strokeWidth={3.5} />
      </Button>
    </div>
  )
}

export { ControlledCountInput }
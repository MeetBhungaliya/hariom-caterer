import { Toaster as Sonner } from 'sonner'

function Toaster({ ...props }) {
  return (
    (
      <Sonner
        className="toaster group [&>[data-sonner-toast][data-type='loading']]:!border-sky-200 [&>[data-sonner-toast][data-type='loading']]:!bg-sky-50 [&>[data-sonner-toast][data-type='loading']]:!text-sky-500 [&_.sonner-loading-bar]:!bg-sky-500"
        style={
          {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
          }
        }
        {...props}
      />
    )
  )
}

export { Toaster }

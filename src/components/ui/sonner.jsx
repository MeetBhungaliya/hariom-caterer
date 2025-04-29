import { Toaster as Sonner } from 'sonner'

function Toaster({ ...props }) {
  return (
    (
      <Sonner
        className="toaster group [&>[data-sonner-toast][data-type='loading']]:!border-sky-600 [&>[data-sonner-toast][data-type='loading']]:!bg-sky-50 [&>[data-sonner-toast][data-type='loading']]:!text-sky-600 [&_.sonner-loading-bar]:!bg-sky-600"
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

import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontalIcon,
} from 'lucide-react'

function Pagination({
  className,
  ...props
}) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={className}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  )
}

function PaginationItem({
  ...props
}) {
  return <li data-slot="pagination-item" {...props} />
}

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}) {
  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }), 'size-10 text-[15px] text-text-1 font-medium border border-border hover:bg-sky-300 hover:text-white shadow-none', 'data-[active=true]:bg-sky-300 data-[active=true]:text-white data-[active=true]:border-sky-400', className)}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={className}
      {...props}
    >
      <span className="hidden sm:block">Previous</span>
      <ChevronLeft className="sm:hidden block" />
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={className}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRight className="sm:hidden block" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}

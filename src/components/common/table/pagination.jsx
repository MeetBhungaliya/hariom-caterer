import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

function Pagination() {
  return (
    <PaginationComponent className="p-4 justify-end rounded-xl bg-white">
      <PaginationContent className="gap-2">
        <PaginationItem>
          <PaginationPrevious href="#" className="min-h-10 py-0 !px-4 size-auto" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" className="min-h-10 py-0 !px-4 size-auto" />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  )
}

export { Pagination }

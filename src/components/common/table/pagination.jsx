import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEFAULT_LIMITS } from '@/constants/common'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useStep } from 'usehooks-ts'

function Pagination({ totalRecords }) {
  const { page, limit, ...rest } = useSearch({ strict: false })
  const navigate = useNavigate()

  const totalPages = Math.ceil(totalRecords / limit)
  const [, helpers] = useStep(totalPages)

  useEffect(() => {
    if (!totalPages)
      return
    try {
      helpers.setStep(Number(page))
    }
    catch {
      navigate({ to: '.', search: { page: 1, limit, ...rest } })
      helpers.setStep(1)
    }
  }, [totalPages, page])

  return (
    <div className="p-2 md:p-4 flex flex-row items-center justify-between rounded-lg md:rounded-xl bg-white">
      <div className="flex w-max items-center gap-x-[10px]">
        <p className="text-text-3 hidden text-sm whitespace-nowrap sm:text-base lg:block">Rows per page :</p>
        <Select value={limit} onValueChange={value => navigate({ to: '.', search: { page, limit: value, ...rest } })}>
          <SelectTrigger className="border-border-1 w-10 justify-center gap-x-0 rounded-lg bg-transparent px-1.5 sm:px-2 py-1 sm:py-1.5 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder={limit} className="text-text-2 text-sm" />
          </SelectTrigger>
          <SelectContent align="middle" className="min-w-20">
            {DEFAULT_LIMITS.map((item, key) => (
              <SelectItem key={key} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-text-3 hidden text-sm sm:text-base md:inline-block">
        <span className="hidden lg:inline-block">Showing</span>
        <span>
          &nbsp;
          {limit * page > totalRecords ? totalRecords : limit}
          &nbsp;
          out of
          &nbsp;
          {totalRecords}
        </span>
        &nbsp;
        <span className="hidden lg:inline-block">results</span>
      </div>

      <PaginationComponent>
        <PaginationContent className="gap-2">
          <PaginationItem>
            <PaginationPrevious className="sm:min-h-10 py-0 has-[>svg]:px-[7px] md:has-[>svg]:px-4 size-8 sm:!size-auto" to="." search={{ page: page - 1, limit, ...rest }} disabled={!helpers.canGoToPrevStep} />
          </PaginationItem>
          {!helpers.canGoToNextStep && helpers.canGoToPrevStep && Boolean(page - 2) && page - 2 <= totalPages && (
            <PaginationItem>
              <PaginationLink to="." search={{ page: page - 2, limit, ...rest }}>{page - 2}</PaginationLink>
            </PaginationItem>
          )}
          {(!helpers.canGoToNextStep || page === totalPages - 1) && helpers.canGoToPrevStep && (
            <PaginationItem>
              <PaginationLink to="." search={{ page: page - 1, limit, ...rest }}>{page - 1}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink to="." search={{ page, limit }} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
          {helpers.canGoToNextStep && (
            <PaginationItem>
              <PaginationLink to="." search={{ page: page + 1, limit, ...rest }}>{page + 1}</PaginationLink>
            </PaginationItem>
          )}
          {helpers.canGoToNextStep && totalPages >= page + 2 && (
            <PaginationItem>
              <PaginationLink to="." search={{ page: page + 2, limit, ...rest }}>{page + 2}</PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext className="sm:min-h-10 py-0 has-[>svg]:px-2 md:has-[>svg]:px-4 size-8 sm:!size-auto" to="." search={{ page: page + 1, limit, ...rest }} disabled={!helpers.canGoToNextStep} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}

export { Pagination }

import { IconButton } from '@/components/common/btn-with-icon'
import { createFileRoute } from '@tanstack/react-router'
import { Boxes, ChevronRight } from 'lucide-react'
import { Route as ItemRoute } from './item'
import { pagination } from '@/constants/common'

export const Route = createFileRoute('/_protected/package/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  return (
    <>
      <div className="h-full flex flex-col gap-y-5">
        <div className="bg-white p-4 rounded-xl flex gap-x-4 justify-end">
          <IconButton icon={<Boxes className="size-5" />} label="Add Package" />
          <IconButton
            iconend
            icon={<ChevronRight className="size-5" />}
            label="View Package Item"
            onClick={() => navigate({ to: ItemRoute.fullPath, search: pagination })}
          />
        </div>
      </div>
    </>
  )
}

import { IconButton } from '@/components/common/btn-with-icon'
import { createFileRoute } from '@tanstack/react-router'
import { Boxes } from 'lucide-react'
import { Route as AddFunctionRoute } from './add'

export const Route = createFileRoute('/_protected/function/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  return (
    <>
      <div className="bg-white p-4 rounded-xl flex justify-end">
        <IconButton icon={<Boxes className="size-5" />} label="Add Function" onClick={() => navigate({ to: AddFunctionRoute.fullPath })} />
      </div>
    </>
  )
}

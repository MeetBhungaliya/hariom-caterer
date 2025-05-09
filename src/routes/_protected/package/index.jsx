import { getPackagesList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { pagination } from '@/constants/common'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Boxes, ChevronRight, Edit } from 'lucide-react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Route as AddPackageRoute } from './add'
import { Route as ItemRoute } from './item'
import { Route as EditPackageRoute } from './$package_id'

export const Route = createFileRoute('/_protected/package/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()

  const packageList = useQuery(getPackagesList())

  if (packageList.isError)
    return null

  return (
    <>
      <div className="h-full flex flex-col gap-y-5 overflow-hidden">
        <div className="bg-white p-4 rounded-xl flex gap-x-4 justify-end">
          <IconButton
            icon={<Boxes className="size-5" />}
            label="Add Package"
            onClick={() => navigate({ to: AddPackageRoute.fullPath })}
          />
          <IconButton
            iconend
            icon={<ChevronRight className="size-5" />}
            label="View Package Item"
            onClick={() => navigate({ to: ItemRoute.fullPath, search: pagination })}
          />
        </div>
        <ScrollArea className="overflow-hidden">
          <ResponsiveMasonry columnsCountBreakPoints={{ 300: 2, 500: 3, 700: 4, 900: 5 }}>
            <Masonry>
              {packageList.data.result.list.map(data => {
                return (
                  <Card key={data.package_id} className="w-full max-w-md h-max py-0 gap-y-0">
                    <CardHeader className="py-4 flex justify-between items-center rounded-t-xl bg-sky-600 gap-0">
                      <CardTitle className="text-white">{data.name}</CardTitle>
                      <Button type="button" className="w-full max-w-8 p-1.5 rounded-sm text-white hover:text-text-1 hover:bg-white"
                        onClick={() => navigate({
                          to: EditPackageRoute.fullPath,
                          params: { package_id: data.package_id },
                          state: data
                        })}
                      >
                        <Edit className='size-4 text-current' />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col justify-center divide-y">
                      {data.package_item.map(item => {
                        return (
                          <div className='flex justify-between px-6 py-2'>
                            <span className="w-full text-sm">{item.name}</span>
                            <span className='w-full text-sm max-w-8 text-center'>{item.quantity}</span>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                )
              })}
            </Masonry>
          </ResponsiveMasonry>
        </ScrollArea>
      </div>
    </>
  )
}

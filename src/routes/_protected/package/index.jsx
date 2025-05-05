import { getPackagesList } from '@/api/query-option'
import { IconButton } from '@/components/common/btn-with-icon'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { pagination } from '@/constants/common'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Boxes, ChevronRight } from 'lucide-react'
import { Route as ItemRoute } from './item'
import { Route as AddPackageRoute } from './add'

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
      <div className="h-full flex flex-col gap-y-5">
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
        <div>
          <Carousel
            opts={{ align: "start" }}
          >
            <CarouselContent>
              {packageList.data.result.list.map((data, index) => {
                return (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="pb-4 gap-y-2">
                      <CardHeader>
                        <CardTitle>{data.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex flex-col justify-center divide-y">
                        {data.package_item.map(item => {
                          return (
                            <div className='px-6 py-2'>
                              <span className="text-base">{item.name}</span>
                            </div>
                          )
                        })}
                      </CardContent>
                    </Card>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            {/* <CarouselPrevious /> */}
            {/* <CarouselNext /> */}
          </Carousel>
        </div>
      </div>
    </>
  )
}

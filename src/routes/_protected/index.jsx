import { getDashboard } from '@/api/query-option'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
})

function RouteComponent() {

  const dashboardData = useQuery(getDashboard())

  console.log(dashboardData)

  return <></>
}

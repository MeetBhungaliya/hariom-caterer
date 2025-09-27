import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/attendance/employee/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/attendance/employee/"!</div>
}

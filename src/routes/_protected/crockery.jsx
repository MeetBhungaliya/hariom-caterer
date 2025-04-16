import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/crockery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/crokery"!</div>
}

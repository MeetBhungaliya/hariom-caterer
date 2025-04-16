import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/party')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/party"!</div>
}

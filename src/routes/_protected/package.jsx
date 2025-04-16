import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/package')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/package"!</div>
}

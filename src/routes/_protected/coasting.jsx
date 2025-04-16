import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/coasting')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/coasting"!</div>
}

import { Sidebar } from '@/components/common/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <SidebarProvider>
    <Sidebar />
  </SidebarProvider>
}

import { Header } from '@/components/common/header'
import { Sidebar } from '@/components/common/sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Route as LoginRoute } from '@/routes/(auth)/login'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  beforeLoad: ({ context, location }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: LoginRoute.fullPath,
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider style={{ '--sidebar-width-icon': '5.5rem' }} className="h-dvh overflow-hidden">
      <Sidebar />
      <SidebarInset style={{ width: 'calc(100dvw - var(--sidebar-width))' }} className="h-full bg-sidebar outline-hidden">
        <Header />
        <div className="p-4 h-full flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

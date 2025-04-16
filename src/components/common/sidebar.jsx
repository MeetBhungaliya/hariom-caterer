import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Route as CoastingRoute } from '@/routes/_protected/coasting'
import { Route as CrockeryRoute } from '@/routes/_protected/crockery'
import { Route as DashboardRoute } from '@/routes/_protected/index'
import { Route as ItemRoute } from '@/routes/_protected/item'
import { Route as PackageRoute } from '@/routes/_protected/package'
import { Route as PartyRoute } from '@/routes/_protected/party'
import { Link } from '@tanstack/react-router'
import { Boxes, ClipboardList, HandCoins, LayoutDashboard, UserRound, UtensilsCrossed } from 'lucide-react'

function Sidebar({ props }) {
  const navLinks = [
    {
      title: 'Dashboard',
      url: DashboardRoute.fullPath,
      icon: <LayoutDashboard />,
    },
    {
      title: 'Costing',
      url: CoastingRoute.fullPath,
      icon: <HandCoins />,
    },
    {
      title: 'Item',
      url: ItemRoute.fullPath,
      icon: <ClipboardList />,
    },
    {
      title: 'Crockery',
      url: CrockeryRoute.fullPath,
      icon: <UtensilsCrossed />,
    },
    {
      title: 'Package',
      url: PackageRoute.fullPath,
      icon: <Boxes />,
    },
    {
      title: 'Party',
      url: PartyRoute.fullPath,
      icon: <UserRound />,
    },
  ]

  return (
    <SidebarComponent {...props} collapsible="icon" style={{ '--sidebar-width-icon': '3.5rem' }}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b overflow-hidden bg-white shadow">
        <h2 className="text-2xl text-center font-black whitespace-nowrap text-ellipsis bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">Hari Om Catering</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {navLinks.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        activeOptions={{
                          includeSearch: false,
                        }}
                        activeProps={{
                          className: 'bg-sky-600 text-white bg-sky-600 text-white hover:bg-sky-600 hover:text-white',
                        }}
                        className="h-max py-3.5 px-4 flex items-center gap-x-4 text-text-1 hover:bg-bg-1 transition-colors"
                      >
                        <div className="min-w-6 min-h-6 text-current">
                          {item.icon}
                        </div>
                        <span className="text-base text-current font-semibold">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </SidebarComponent>
  )
}

export { Sidebar }

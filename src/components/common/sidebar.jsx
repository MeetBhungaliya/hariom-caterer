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
  useSidebar,
} from '@/components/ui/sidebar'
import { navLinks } from '@/constants/common'
import { SIDEBAR_INDICATOR } from '@/constants/image'
import { Link, useLocation } from '@tanstack/react-router'
import { useCallback, useMemo } from 'react'

function Sidebar({ props }) {
  const sidebarState = useSidebar()
  const { pathname } = useLocation()

  const activeIndex = useMemo(() => navLinks().findIndex(item => pathname === item.url), [pathname])

  const ITEM_HEIGHT = 52
  const ITEM_GAP = 12

  const getTopPosition = useCallback(() => {
    const addition = activeIndex ? ITEM_GAP + ITEM_HEIGHT : 0
    return 16 + addition * activeIndex
  }, [activeIndex, sidebarState.open])

  return (
    <SidebarComponent {...props} collapsible="icon">
      <SidebarHeader className="h-16 flex items-center justify-center border-b overflow-hidden bg-white shadow">
        <h2 className="text-2xl text-center font-black whitespace-nowrap text-ellipsis bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          {sidebarState.open ? 'Rahul' : 'R'}
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <div
          style={{ top: `${64 + getTopPosition()}px`, height: `${ITEM_HEIGHT}px` }}
          className="w-[1px] absolute right-[-1px] transition-all ease-linear duration-150 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-400 z-50"
          src={SIDEBAR_INDICATOR}
          alt="indicator"
        />
        <SidebarGroup className="p-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {navLinks().map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        search={item.search}
                        activeOptions={{ includeSearch: false }}
                        activeProps={{
                          className: 'bg-sky-600 text-white bg-sky-600 text-white hover:bg-sky-600 hover:text-white',
                        }}
                        className="h-max py-3 px-4 flex items-center gap-x-4 text-text-1 hover:bg-bg-1 transition-colors"
                      >
                        <div className="min-w-6 min-h-6 text-current">
                          <item.icon />
                        </div>
                        <span className="text-lg text-current font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="after:w-0" />
    </SidebarComponent>
  )
}

export { Sidebar }

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { navLinks } from '@/constants/common'
import { cn } from '@/lib/utils'
import { useLocation } from '@tanstack/react-router'
import { SidebarTrigger, useSidebar } from '../ui/sidebar'

function Header() {
  const sidebarState = useSidebar()
  const { pathname } = useLocation()

  const items = navLinks.find(item => item.url === pathname)

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b px-4 bg-white shadow">
      <SidebarTrigger className={cn('h-auto w-auto p-2 border hover:bg-sky-50 [&_svg]:duration-500 [&_svg]:transition-all', sidebarState.open ? '[&_svg]:rotate-0' : '[&_svg]:rotate-180')} />
      <Breadcrumb>
        <BreadcrumbList>
          {/* <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">
              Building Your Application
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" /> */}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xl font-medium text-text-1">{items?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

export { Header }

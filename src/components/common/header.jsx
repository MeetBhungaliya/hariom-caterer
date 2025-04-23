import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { navLinks } from '@/constants/common'
import { cn } from '@/lib/utils'
import { Route as SubCategoryRoute } from '@/routes/_protected/foods/$category-id'
import { useLocation, useMatch } from '@tanstack/react-router'
import { SidebarTrigger, useSidebar } from '../ui/sidebar'

function Header() {
  const sidebarState = useSidebar()
  const { pathname } = useLocation()
  const subCategoryRoute = useMatch({ from: SubCategoryRoute.id, shouldThrow: false })

  const items = navLinks().find((item) => {
    let url = item.url

    if (item.active) {
      url = item.url.replace(new RegExp(`${item.active}$`), '')
    }

    return url === pathname
  })

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b px-4 bg-white shadow">
      <SidebarTrigger className={cn('h-auto w-auto p-2 border hover:bg-sky-50 [&_svg]:duration-500 [&_svg]:transition-all', sidebarState.open ? '[&_svg]:rotate-0' : '[&_svg]:rotate-180')} />
      <Breadcrumb>
        <BreadcrumbList>
          {subCategoryRoute?.fullPath?.split('/')?.length > 2
            ? (
                <>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink to={subCategoryRoute.fullPath.split('/').slice(0, -1).join('/')} className="text-xl font-medium hover:underline">
                      Item
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block [&>svg]:size-5" />
                </>
              )
            : null}

          {subCategoryRoute?.params?.['category-id']
            ? (
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xl font-medium text-text-1">{subCategoryRoute?.search?.name || 'Subcategory'}</BreadcrumbPage>
                </BreadcrumbItem>
              )
            : (
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-xl font-medium text-text-1">{items?.title}</BreadcrumbPage>
                </BreadcrumbItem>
              )}

        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}

export { Header }

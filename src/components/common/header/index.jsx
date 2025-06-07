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
import Logout from './logout'
import { Route as SubCategoryRoute } from '@/routes/_protected/food/$category-id'
import { useLocation, useMatch } from '@tanstack/react-router'
import { SidebarTrigger, useSidebar } from '../../ui/sidebar'
import { Route as AddItemRoute } from '@/routes/_protected/item/add'
import { Route as UpdateItemRoute } from '@/routes/_protected/item/$item_id'

function Header() {
  const sidebarState = useSidebar()
  const { pathname } = useLocation()
  const subCategoryRoute = useMatch({ from: SubCategoryRoute.id, shouldThrow: false })
  const addItemRoute = useMatch({ from: AddItemRoute.id, shouldThrow: false })
  const updateItemRoute = useMatch({ from: UpdateItemRoute.id, shouldThrow: false })

  const items = navLinks().find((item) => {
    let url = item.url

    if (item.active) {
      url = item.url.replace(new RegExp(`${item.active}$`), '')
    }

    return url === pathname
  })

  return (
    <header className="flex h-16 shrink-0 justify-between items-center gap-x-4 border-b px-4 bg-white shadow">
      <nav className="flex items-center gap-x-4">
        <SidebarTrigger
          className={cn(
            "h-auto w-auto p-2 border hover:bg-sky-600 hover:[&_svg]:stroke-white [&_svg]:transition-all",
            sidebarState.open ? "[&_svg]:rotate-0" : "[&_svg]:rotate-180"
          )}
        />
        <Breadcrumb>
          <BreadcrumbList>
            {subCategoryRoute?.fullPath?.split("/")?.length > 2 ? (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    to={subCategoryRoute.fullPath
                      .split("/")
                      .slice(0, -1)
                      .join("/")}
                    className="text-xl font-medium hover:underline"
                  >
                    Foods
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block [&>svg]:size-5" />
              </>
            ) : null}

            {subCategoryRoute?.params?.["category-id"] ? (
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-medium text-text-1">
                  {subCategoryRoute?.search?.name || "Subcategory"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-medium text-text-1">
                  {items?.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}

            {(addItemRoute || updateItemRoute)?.fullPath?.split("/")?.length >
            2 ? (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    to={(addItemRoute || updateItemRoute).fullPath
                      .split("/")
                      .slice(0, -1)
                      .join("/")}
                    className="text-xl font-medium hover:underline"
                  >
                    Items
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block [&>svg]:size-5" />
              </>
            ) : null}

            {addItemRoute && (
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-medium text-text-1">
                  Add Item
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}

            {updateItemRoute && (
              <BreadcrumbItem>
                <BreadcrumbPage className="text-xl font-medium text-text-1">
                  Update Item
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
      <Logout />
    </header>
  );
}

export { Header }

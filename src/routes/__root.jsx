import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext()({
  component: () => (
    <>
      <Outlet />
      {/* <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools /> */}
    </>
  ),
});

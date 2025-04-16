import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useAuthStore } from './hooks/use-auth'

import { routeTree } from './routeTree.gen'
import './css/global.css'

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ isAuthenticated }} />
    </QueryClientProvider>
  )
}

export default App

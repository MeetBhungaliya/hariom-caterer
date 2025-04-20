import { Route as CoastingRoute } from '@/routes/_protected/coasting'
import { Route as CrockeryRoute } from '@/routes/_protected/crockery'
import { Route as DashboardRoute } from '@/routes/_protected/index'
import { Route as ItemRoute } from '@/routes/_protected/item'
import { Route as PackageRoute } from '@/routes/_protected/package'
import { Route as PartyRoute } from '@/routes/_protected/party'
import { Boxes, ClipboardList, HandCoins, LayoutDashboard, UserRound, UtensilsCrossed } from 'lucide-react'

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 10
export const DEFAULT_LIMITS = [5, 10, 15, 20, 50]

export const pagination = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
}

export function navLinks() {
  return [
    {
      title: 'Dashboard',
      url: DashboardRoute.fullPath,
      icon: LayoutDashboard,
      search: pagination,
    },
    {
      title: 'Costing',
      url: CoastingRoute.fullPath,
      icon: HandCoins,
      search: pagination,
    },
    {
      title: 'Item',
      url: ItemRoute.fullPath,
      icon: ClipboardList,
      search: pagination,
    },
    {
      title: 'Crockery',
      url: CrockeryRoute.fullPath,
      icon: UtensilsCrossed,
      search: pagination,
    },
    {
      title: 'Package',
      url: PackageRoute.fullPath,
      icon: Boxes,
      search: pagination,
    },
    {
      title: 'Party',
      url: PartyRoute.fullPath,
      icon: UserRound,
      search: pagination,
    },
  ]
}

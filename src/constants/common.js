import { Route as CoastingRoute } from '@/routes/_protected/coasting/index'
import { Route as CrockeryRoute } from '@/routes/_protected/crockery'
import { Route as FoodsRoute } from '@/routes/_protected/food/index'
import { Route as DashboardRoute } from '@/routes/_protected/index'
import { Route as ItemsRoute } from '@/routes/_protected/item/index'
import { Route as PackageRoute } from '@/routes/_protected/package'
import { Route as PartyRoute } from '@/routes/_protected/party'
import { Route as FunctionRoute } from '@/routes/_protected/function'
import { Route as AttendanceRoute } from '@/routes/_protected/attendance'
import { Apple, Boxes, ClipboardList, HandCoins, LayoutDashboard, NotebookText, Package, UserRound, UtensilsCrossed } from 'lucide-react'
import moment from 'moment'

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
      title: 'Food',
      url: FoodsRoute.fullPath,
      icon: Apple,
      search: pagination,
      active: FoodsRoute.parentRoute.fullPath,
    },
    {
      title: 'Item',
      url: ItemsRoute.fullPath,
      icon: ClipboardList,
      search: pagination,
      active: ItemsRoute.parentRoute.fullPath,
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
      icon: Package,
    },
    {
      title: 'Party',
      url: PartyRoute.fullPath,
      icon: UserRound,
      search: pagination,
    },
    {
      title: 'Function',
      url: FunctionRoute.fullPath,
      icon: Boxes,
      search: pagination,
    },
    {
      title: 'Attendance',
      url: AttendanceRoute.fullPath,
      icon: NotebookText,
      search: { ...pagination, month: moment().get("month") + 1, year: moment().get("year") },
    },
  ]
}

export const TIME_OPTIONS = [
  { value: "Morning", label: "Morning" },
  { value: "Evening", label: "Evening" },
  { value: "Afternoon", label: "Afternoon" },
  { value: "Night", label: "Night" },
]

export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" }
];

export const YEARS = () => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 20;
  // const endYear = currentYear + 7;
  const endYear = currentYear;

  return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
    const year = startYear + i;
    return { value: year, label: year.toString() };
  });
};

export const SALARY_TYPE = [
  { value: "advance", label: "Advance" },
  { value: "payout", label: "Payout" },
]

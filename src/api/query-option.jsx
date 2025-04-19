import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/common'
import { GET_PARTIES } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { sleep } from '@/lib/utils'
import { queryOptions } from '@tanstack/react-query'

function getCurrentPage() {
  const params = new URL(window.location.href).searchParams
  return params.get('page') || DEFAULT_PAGE
}

function getPageLimit() {
  const params = new URL(window.location.href).searchParams
  return params.get('limit') || DEFAULT_LIMIT
}

export const getPartiesList = queryOptions({
  queryKey: [GET_PARTIES],
  queryFn: async () => {
    await sleep(5000)
    return fetchApi({ url: `${GET_PARTIES}?page=${getCurrentPage()}&limit=${getPageLimit()}` })
  },
  placeholderData: { result: { list: [], totalRecords: null } },
})

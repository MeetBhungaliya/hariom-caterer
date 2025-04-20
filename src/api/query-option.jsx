import { GET_PARTIES } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { queryOptions } from '@tanstack/react-query'

export function getPartiesList({ page, limit }) {
  return queryOptions({
    queryKey: [GET_PARTIES, page, limit],
    queryFn: async () => {
    // await sleep(5000)
      return fetchApi({ url: `${GET_PARTIES}?page=${page}&limit=${limit}` })
    },
    placeholderData: { result: { list: [], totalRecords: null } },
  })
}

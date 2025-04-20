import { GET_CROCKERIES, GET_PARTIES } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { queryOptions } from '@tanstack/react-query'

export function getPartiesList({ page, limit }) {
  return queryOptions({
    queryKey: [GET_PARTIES, page, limit],
    queryFn: async () => fetchApi({ url: `${GET_PARTIES}?page=${page}&limit=${limit}` }),
    placeholderData: { result: { list: [], totalRecords: null } },
  })
}

export function getCrockeryList({ page, limit, search }) {
  return queryOptions({
    queryKey: [GET_PARTIES, page, limit, search],
    queryFn: async () => fetchApi({ url: `${GET_CROCKERIES}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`.trim() }),
    placeholderData: { result: { list: [], totalRecords: null } },
  })
}

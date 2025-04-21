import { GET_CATEGORIES, GET_CROCKERIES, GET_PARTIES, GET_SUBCATEGORIES } from '@/constants/endpoints'
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

export function getCategoryList({ page, limit, search }) {
  return queryOptions({
    queryKey: [GET_CATEGORIES, page, limit, search],
    queryFn: async () => fetchApi({ url: `${GET_CATEGORIES}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`.trim() }),
    placeholderData: { result: { list: [], totalRecords: null } },
  })
}

export function getSubCategoryList({ page, limit, search, category_id }) {
  return queryOptions({
    queryKey: [GET_SUBCATEGORIES, page, limit, search, category_id],
    queryFn: async () => fetchApi({ url: `${GET_SUBCATEGORIES}?page=${page}&limit=${limit}${category_id ? `&category_id=${category_id}` : ''}${search ? `&search=${search}` : ''}`.trim() }),
    placeholderData: { result: { list: [], totalRecords: null } },
  })
}

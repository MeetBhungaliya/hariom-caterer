import { GET_CATEGORIES, GET_CROCKERIES, GET_ITEM_CROCKERIES, GET_SUBCATEGORIES } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { queryOptions } from '@tanstack/react-query'

export function getCategoriesOption() {
  return queryOptions({
    queryKey: [GET_CATEGORIES],
    queryFn: async () => fetchApi({ url: GET_CATEGORIES }),
    placeholderData: [],
  })
}

export function getSubCategoriesOption({ category_id }) {
  return queryOptions({
    queryKey: [GET_SUBCATEGORIES, category_id],
    queryFn: async () => fetchApi({ url: `${GET_SUBCATEGORIES}?${category_id ? `category_id=${category_id}` : ''}` }),
    placeholderData: [],
  })
}

export function getAllCrockeryOption() {
  return queryOptions({
    queryKey: [GET_CROCKERIES],
    queryFn: async () => fetchApi({ url: GET_CROCKERIES }),
    placeholderData: [],
  })
}


export function getItemCrockeryOption({ item_id, category_id }) {
  return queryOptions({
    queryKey: [GET_ITEM_CROCKERIES, category_id],
    queryFn: async () => fetchApi({ url: `${GET_ITEM_CROCKERIES}?${category_id ? `category_id=${category_id}` : ''}&${category_id ? `item_id=${item_id}` : ''}` }),
    placeholderData: [],
  })
}

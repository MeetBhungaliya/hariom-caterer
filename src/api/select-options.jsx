import { GET_CATEGORIES, GET_CROCKERIES, GET_ITEM_CROCKERIES, GET_LIST_OF_ITEM_OF_PACKAGE, GET_PACKAGE_ITEMS, GET_PACKAGES, GET_PARTIES, GET_SUBCATEGORIES } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { queryOptions } from '@tanstack/react-query'

export function getCategoriesOption({ paginate }) {
  return queryOptions({
    queryKey: [GET_CATEGORIES],
    queryFn: async () => fetchApi({ url: `${GET_CATEGORIES}?${paginate ? `paginate=${paginate}` : ""}` }),
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
    queryFn: async () => fetchApi({ url: `${GET_CROCKERIES}?paginate=false` }),
    placeholderData: [],
  })
}


export function getItemCrockeryOption({ category_id }) {
  return queryOptions({
    queryKey: [GET_ITEM_CROCKERIES, category_id],
    queryFn: async () => fetchApi({ url: `${GET_ITEM_CROCKERIES}?${category_id ? `category_id=${category_id}` : ''}` }),
    placeholderData: [],
  })
}

export function getPackageItemList() {
  return queryOptions({
    queryKey: [GET_PACKAGE_ITEMS],
    queryFn: async () => fetchApi({ url: GET_PACKAGE_ITEMS }),
    placeholderData: { result: { list: [], totalRecords: null } },
  })
}

export function getAllPartyOption() {
  return queryOptions({
    queryKey: [GET_PARTIES],
    queryFn: async () => fetchApi({ url: `${GET_PARTIES}?paginate=false` }),
    placeholderData: [],
  })
}

export function getAllPackageOption() {
  return queryOptions({
    queryKey: [GET_PACKAGES],
    queryFn: async () => fetchApi({ url: `${GET_PACKAGES}?paginate=false` }),
    placeholderData: [],
  })
}

export function getListOfItemOfPackage({ pim_id }) {
  return queryOptions({
    queryKey: [GET_LIST_OF_ITEM_OF_PACKAGE, pim_id],
    queryFn: async () => fetchApi({ url: `${GET_LIST_OF_ITEM_OF_PACKAGE}?pim_id=${pim_id}` }),
    placeholderData: [],
  })
}
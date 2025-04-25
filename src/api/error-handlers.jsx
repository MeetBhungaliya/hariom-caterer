import { METHODS } from '@/constants/common'
import { REFRESH_TOKEN } from '@/constants/endpoints'
import messages from '@/constants/messages'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { tryCatch } from '@/lib/utils'
import { Route as LoginRoute } from '@/routes/(auth)/login'
import { toast } from 'sonner'

let isRedirecting = false
let isRefreshing = false
let failedQueue = []

export function queryErrorHandler(error, query) {
  errorHandler(error, query)
}

export function mutationErrorHandler(error, variables, context, mutation) {
  errorHandler(error, undefined, mutation, variables)
}

async function errorHandler(error, query, mutation, variables) {
  const { status, data } = error.response
  const { setloading } = useAuthStore.getState()

  try {
    setloading(true)

    if (status === 401) {
      if (mutation) {
        await refreshTokenAndRetry(undefined, mutation, variables)
      }
      else {
        await refreshTokenAndRetry(query)
      }
    }
    else {
      console.error(data?.message)
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    setloading(false)
  }
}

function processFailedQueue() {
  failedQueue.forEach(({ query, mutation, variables }) => {
    if (mutation) {
      const { options } = mutation
      mutation.setOptions({ ...options, variables })
      mutation.execute()
    }
    if (query) {
      query.fetch()
    }
  })
  isRefreshing = false
  failedQueue = []
}

async function refreshTokenAndRetry(query, mutation, variables) {
  const { user, adduser, removeuser } = useAuthStore.getState()

  try {
    const refreshToken = `Bearer ${user?.refreshToken}`

    if (!isRefreshing && user?.refreshToken) {
      isRefreshing = true
      failedQueue.push({ query, mutation, variables })

      const refreshTokenResult = await tryCatch(() => fetchApi({
        method: METHODS.POST,
        url: REFRESH_TOKEN,
        headers: { Authorization: refreshToken },
      }))

      if (!refreshTokenResult.success || !refreshTokenResult.value || refreshTokenResult.value.ResponseCode !== 1)
        throw messages.default.session_expired

      adduser(refreshTokenResult.value.result)
      processFailedQueue()
    }
    else {
      failedQueue.push({ query, mutation, variables })
    }
  }
  catch (error) {
    console.error(error, 'logout reason')

    removeuser()

    if (!isRedirecting) {
      isRedirecting = true
      window.location = LoginRoute.fullPath
    }

    if (typeof error === 'string')
      toast.error(error)
    else
      toast.error(messages.default.session_expired)
  }
}

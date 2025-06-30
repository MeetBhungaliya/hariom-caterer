import { ControlledInput } from '@/components/common/controlled-input'
import { ControlledPasswordInput } from '@/components/common/controlled-passwordinput'
import { Button } from '@/components/ui/button'
import { METHODS, pagination } from '@/constants/common'
import { LOGIN } from '@/constants/endpoints'
import { useAuthStore } from '@/hooks/use-auth'
import { fetchApi } from '@/lib/api'
import { loginSchema } from '@/lib/schema'
import { asyncResponseToaster } from '@/lib/toasts'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import md5 from 'md5'
import { z } from 'zod'
import { Route as IndexRoute } from '../_protected/index'

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: search.redirect || IndexRoute.fullPath, search: search.redirect ? undefined : pagination })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const adduser = useAuthStore(state => state.adduser)
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const loginMutation = useMutation({
    mutationFn: async data => fetchApi({ url: LOGIN, method: METHODS.POST, data }),
  })

  const onSubmit = async ({ value }) => {
    const result = await asyncResponseToaster(() => loginMutation.mutateAsync({ email: value.email.toLowerCase(), password: md5(value.password) }))

    if (result.success && result.value && result.value.ResponseCode === 1) {
      adduser(result.value.result)
      await navigate({
        to: search.redirect || IndexRoute.fullPath,
        search: search.redirect ? undefined : pagination,
      }, { replace: true })
    }
  }

  const { Field, handleSubmit, Subscribe } = useForm({
    onSubmit,
    validators: { onSubmit: loginSchema },
  })

  return (
    <div className="h-dvh p-6 flex bg-[url('/assets/images/loginbg.png')] bg-cover">
      <div className="flex-1" />
      <div className="flex-[100%] md:flex-[60%] lg:flex-1 flex justify-center items-center">
        <div className="h-max w-full max-w-xl p-6 md:p-10 flex flex-col items-center justify-center bg-white rounded-3xl shadow-[16px_16px_32px_#acacac,_-16px_-16px_32px_#ffffff]">
          <div className="space-y-3 text-center mb-10 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl md:text-4xl font-bold">Welcome</h2>
            <p className="text-sm md:text-base font-medium">
              Please login to admin dashboard.
            </p>
          </div>
          <form
            className="w-full max-w-lg space-y-4 md:space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <Field
              name="email"
              children={(field) => (
                <ControlledInput
                  id="email"
                  label="Email or username"
                  field={field}
                  prefix={<Mail className="size-5" />}
                />
              )}
            />
            <Field
              name="password"
              children={(field) => (
                <ControlledPasswordInput
                  id="password"
                  label="Password"
                  field={field}
                />
              )}
            />
            <div className="mt-10 sm:mt-16 lg:mt-20">
              <Subscribe
                selector={(state) => state.isDirty}
                children={(isDirty) => (
                  <Button
                    type="submit"
                    className="w-full rounded-xl font-semibold tracking-wide bg-sky-600 text-white"
                    disabled={!isDirty || loginMutation.isPending}
                  >
                    Login
                  </Button>
                )}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

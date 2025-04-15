import { ControlledInput } from "@/components/common/controlled-input";
import { ControlledPasswordInput } from "@/components/common/controlled-passwordinput";
import { Button } from "@/components/ui/button";
import { METHODS } from "@/constants/common";
import { LOGIN } from "@/constants/endpoints";
import { useAuthStore } from "@/hooks/use-auth-1";
import { fetchApi } from "@/lib/api";
import { loginSchema } from "@/lib/schema";
import { responseToaster, tryCatch } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { z } from "zod";
import { Route as IndexRoute } from "../_protected/index";

export const Route = createFileRoute("/(auth)/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || IndexRoute.path });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  // const auth = useAuth();
  const addUser = useAuthStore((state) => state.adduser);
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const onSubmit = async ({ value }) => {
    const loginResult = await tryCatch(() => loginMutation.mutateAsync(value));

    responseToaster(loginResult.value);

    console.log(loginResult);
    return;

    addUser(loginResult.value.data.result);

    await navigate(
      { to: search.redirect || IndexRoute.path },
      { replace: true }
    );
  };

  const { Field, handleSubmit, Subscribe } = useForm({
    onSubmit,
    validators: { onSubmit: loginSchema },
  });

  const loginMutation = useMutation({
    mutationFn: async (data) =>
      await fetchApi({ url: LOGIN, method: METHODS.POST, data }),
  });

  return (
    <div className="h-dvh p-6 flex bg-[url('/loginbg.png')] bg-cover">
      <div className="flex-1" />
      <div className="flex-1 flex justify-center items-center">
        <div className="h-max w-full max-w-xl p-10 flex flex-col items-center justify-center bg-white rounded-3xl shadow-[16px_16px_32px_#acacac,_-16px_-16px_32px_#ffffff]">
          <div className="space-y-3 text-center mb-20">
            <h2 className="text-4xl font-bold">Welcome</h2>
            <p className="text-base font-medium">
              Please login to admin dashboard.
            </p>
          </div>
          <form
            className="w-full max-w-lg space-y-6"
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
                  label="Email"
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
            <div className="mt-20">
              <Subscribe
                selector={(state) => state.isDirty}
                children={(isDirty) => (
                  <Button
                    type="submit"
                    className="w-full rounded-xl font-semibold tracking-wide"
                    disabled={!isDirty}
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

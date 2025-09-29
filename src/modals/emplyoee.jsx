import { getPartiesList } from '@/api/query-option'
import { ControlledInput } from '@/components/common/controlled-input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { METHODS } from '@/constants/common'
import { ADD_EMPLOYEE, UPDATE_EMPLOYEE } from '@/constants/endpoints'
import { fetchApi } from '@/lib/api'
import { addEditEmployeeSchema } from '@/lib/schema'
import { asyncResponseToaster } from '@/lib/toasts'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IndianRupee, PhoneCall, UserPen } from 'lucide-react'

function AddEditEmployee({ modalState, data, setData }) {
  const queryClient = useQueryClient();

  const addEmployeeMutation = useMutation({
    mutationFn: async (data) =>
      fetchApi({ url: ADD_EMPLOYEE, method: METHODS.POST, data }),
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async (data) =>
      fetchApi({ url: UPDATE_EMPLOYEE, method: METHODS.PUT, data }),
  });

  const { Field, handleSubmit, Subscribe, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addEditEmployeeSchema },
    defaultValues: data ? data : { ...data, status: "active" },
  });

  async function onSubmit({ value }) {
    let result = null;

    if ("emp_id" in value) {
      result = await asyncResponseToaster(() =>
        updateEmployeeMutation.mutateAsync({
          ...value,
          status: value?.status ? "active" : "inactive",
        })
      );
    } else {
      result = await asyncResponseToaster(() =>
        addEmployeeMutation.mutateAsync({
          ...value,
          status: value?.status ? "active" : "inactive",
        })
      );
    }

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getPartiesList);
      onClose();
    }
  }

  function onClose() {
    setTimeout(() => {
      modalState.setFalse();
      reset({ name: undefined, phone: undefined });
      setData(undefined);
    }, 150);
  }

  return (
    <Dialog
      open={modalState.value}
      onOpenChange={(e) => {
        if (!e) onClose();
        modalState.setValue(e);
      }}
    >
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 bg-bg-1 rounded-t-xl shadow">
          <DialogTitle className="text-center text-xl font-bold">
            {data ? "Update" : "Add"}
            &nbsp; Employee
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>
              add or update employee information
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <div className="p-4 md:p-6 space-y-3 md:space-y-6">
            <Field
              name="name"
              children={(field) => (
                <ControlledInput
                  id="name"
                  label="Employee name"
                  field={field}
                  prefix={<UserPen className="size-5" />}
                />
              )}
            />
            <Field
              name="phone"
              children={(field) => (
                <ControlledInput
                  id="phone"
                  label="Phone number"
                  type="number"
                  field={field}
                  prefix={<PhoneCall className="size-5" />}
                />
              )}
            />
            <Field
              name="rate"
              children={(field) => (
                <ControlledInput
                  id="rate"
                  label="Rate"
                  type="number"
                  field={field}
                  prefix={<IndianRupee className="size-5" />}
                />
              )}
            />
           
              <Field
                name="status"
                children={(field) => {
                  return (
                    <div className="flex items-center justify-between gap-x-2">
                      <Label
                        htmlFor="status"
                        className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400"
                      >
                        Employment Status
                      </Label>
                      <Switch
                        className="size-auto w-14 md:w-16 h-6 md:h-7 [&>*:first-child]:size-4 md:[&>*:first-child]:size-5 [&>*:first-child]:data-[state=unchecked]:translate-x-1 md:[&>*:first-child]:data-[state=unchecked]:translate-x-1 [&>*:first-child]:data-[state=checked]:translate-x-[35px] md:[&>*:first-child]:data-[state=checked]:translate-x-[38px] data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-sky-600"
                        checked={Boolean(field.state.value)}
                        onCheckedChange={field.handleChange}
                      />
                    </div>
                  );
                }}
              />
          </div>
          <div className="w-full h-[1px] shadow bg-bg-1" />
          <DialogFooter className="px-4 md:px-6 py-3 md:py-4 gap-x-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="py-2 text-sm md:text-base border border-transparent hover:border"
              >
                Cancel
              </Button>
            </DialogClose>
            <Subscribe
              selector={(state) => state.isDirty}
              children={(isDirty) => (
                <Button
                  type="submit"
                  className="py-2 text-sm md:text-base bg-sky-600 text-white"
                  disabled={
                    !isDirty ||
                    addEmployeeMutation.isPending ||
                    updateEmployeeMutation.isPending
                  }
                >
                  {data ? "Update" : "Save"}
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { AddEditEmployee }


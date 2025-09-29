import { getMonthWiseShiftsList } from "@/api/query-option";
import { ControlledInput } from "@/components/common/controlled-input";
import { ControlledSelect } from "@/components/common/controlled-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { METHODS, SALARY_TYPE } from "@/constants/common";
import { ADD_SALARY } from "@/constants/endpoints";
import { fetchApi } from "@/lib/api";
import { addSalarySchema } from "@/lib/schema";
import { asyncResponseToaster } from "@/lib/toasts";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, IndianRupee } from "lucide-react";
import moment from "moment";

const AddSalary = ({ modalState, data, setData }) => {
  const queryClient = useQueryClient();

  const { Field, handleSubmit, Subscribe, reset } = useForm({
    onSubmit,
    validators: { onSubmit: addSalarySchema },
    defaultValues: data,
  });

  const addSalaryMutation = useMutation({
    mutationFn: async (data) =>
      fetchApi({ url: ADD_SALARY, method: METHODS.POST, data }),
  });

  async function onSubmit({ value }) {
    const result = await asyncResponseToaster(() =>
      addSalaryMutation.mutateAsync({
        ...value,
        date: moment(value.date).format("YYYY-MM-DD"),
      })
    );

    if (result.success && result.value && result.value.ResponseCode === 1) {
      queryClient.refetchQueries(getMonthWiseShiftsList);
      onClose();
    }
  }

  function onClose() {
    setTimeout(() => {
      modalState.setFalse();
      reset({
        emp_id: undefined,
        type: undefined,
        amount: undefined,
        date: undefined,
      });
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
            Add Salary
          </DialogTitle>
          <VisuallyHidden.Root>
            <DialogDescription>
              add or update salary information
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
              name="type"
              children={(field) => (
                <ControlledSelect
                  id="type"
                  label="Salary Type"
                  field={field}
                  options={SALARY_TYPE}
                  prefix={<IndianRupee className="size-5" />}
                  placeholder="Select salary type"
                />
              )}
            />
            <Field
              name="amount"
              children={(field) => (
                <ControlledInput
                  id="amount"
                  label="Salary amount"
                  field={field}
                  prefix={<IndianRupee className="size-5" />}
                />
              )}
            />
            <Field
              name="date"
              children={(field) => (
                <ControlledInput
                  id="date"
                  label="Select date"
                  field={field}
                  type="date"
                  className={cn(
                    "py-2.5",
                    !field.state.value && "text-gray-500"
                  )}
                  prefix={<Calendar className="size-5" />}
                />
              )}
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
                  disabled={false}
                >
                  Save
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSalary;

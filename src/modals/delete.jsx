import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const DeleteModal = ({
  state,
  Icon,
  onClose,
  name,
  title,
  onSucess,
  isLoading,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={state?.open} onOpenChange={handleClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[455px] p-0 pt-4 md:pt-6 rounded-xl"
      >
        <div className="flex flex-col justify-center items-center gap-y-4">
          <div className="flex items-center bg-sky-600 rounded-full justify-center size-[100px]">
            <Icon className="size-16 text-white" />
          </div>
          <div className="px-4 md:px-6 space-y-2 mx-auto">
            <DialogTitle className="mb-0 text-primary font-bold text-[26px] text-center">
              Delete {name ?? ""}?
            </DialogTitle>
            <VisuallyHidden.Root>
              <DialogDescription>common delete modal</DialogDescription>
            </VisuallyHidden.Root>
            <p className="text-[18px] text-center font-normal text-[#3D4152]">
              Are you sure you want to delete <br></br>“
              <span className="font-semibold text-[18px] text-main">
                {title}
              </span>
              ”?
            </p>
          </div>
          <div className="w-full h-[1px] mb-0 shadow bg-bg-1" />
          <DialogFooter className="w-full px-4 md:px-6 pb-3 md:pb-4 gap-x-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="py-2 px-6 text-sm md:text-base border border-transparent hover:border"
                onClick={handleClose}
                disabled={isLoading}
              >
                No
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="py-2 px-6 text-sm md:text-base bg-sky-600 text-white"
              disabled={isLoading}
              onClick={async () => {
                await onSucess();
                handleClose();
              }}
            >
              Yes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;

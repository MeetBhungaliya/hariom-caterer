import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, UserRound, X } from "lucide-react";
import { Route as LoginRoute } from "@/routes/(auth)/login";
import { useBoolean } from "usehooks-ts";
import { useAuthStore } from "@/hooks/use-auth";

const index = () => {
  const navigate = useNavigate();
  const logoutModal = useBoolean(false);
  const { user, removeuser } = useAuthStore();

  const onLogout = () => {
    removeuser();
    navigate({ to: LoginRoute.fullPath });
  };

  return (
    <Popover modal open={logoutModal.value} onOpenChange={logoutModal.setValue}>
      <PopoverTrigger className="relative cursor-pointer">
        <UserRound className="size-6 md:size-7 stroke-text-1 stroke-[1.5px]" />
      </PopoverTrigger>
      <PopoverContent
        overlay
        align="end"
        className="w-[180px] md:w-[256px] p-3.5 md:p-5 space-y-4 md:space-y-6 rounded-xl"
      >
        <div className="flex flex-col gap-y-1">
          <h4 className="text-text-1 font-medium text-sm md:text-base">{user?.name}</h4>
          <span className="text-xs md:text-sm text-text-1 opacity-40">{user?.email}</span>
        </div>
        <Button
          type="button"
          className="w-full pl-4 justify-between text-xs md:text-sm text-white border border-sky-600 rounded-full bg-sky-600 hover:text-sky-600 hover:bg-transparent"
          onClick={onLogout}
        >
          Logout
          <ChevronRight className="size-4" />
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default index;

"use client";
import { SIDEBAR_CONSTANTS } from "@/utils/constants";
import { SignOutButton } from "@clerk/nextjs";
import { CircleDollarSign, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSidebarClick = (id: string) => {
    router.push(id);
  };

  if (pathname === "/login" || pathname === "/sign-up") {
    return null;
  }

  return (
    <div className="bg-sidebar w-1/5 h-screen shrink-0 flex justify-between flex-col p-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="text-white h-9 w-9" />
          <span className="text-white font-semibold text-base">Expense Tracker</span>
        </div>

        <span className="text-gray-400 text-xs font-medium tracking-wide mt-8">MENU</span>

        <div className="ml-2 mt-4 flex flex-col gap-1">
          {SIDEBAR_CONSTANTS.map((item) => {
            const { icon: Icon, title, id } = item;
            const itemSelectedClass =
              id === pathname ? "bg-woodsmoke border-shark text-white" : "";

            return (
              <div
                key={id}
                className={cn(
                  "flex items-center gap-2 cursor-pointer py-2 px-3 rounded-md w-[95%] border border-transparent transition-colors hover:bg-woodsmoke/60",
                  itemSelectedClass
                )}
                onClick={() => handleSidebarClick(id)}
              >
                <Icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300">{title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <SignOutButton redirectUrl="/login">
        <button className="flex items-center gap-2 cursor-pointer bg-[#17181c] hover:bg-[#1f2024] transition-colors py-2 px-3 rounded-md">
          <LogOut className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">Logout</span>
        </button>
      </SignOutButton>
    </div>
  );
};

export default SideBar;
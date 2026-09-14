"use client";

import { SIDEBAR_CONSTANTS, USER_IMAGE } from "@/utils/constants";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { CircleDollarSign, LogOut, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (pathname === "/login" || pathname === "/sign-up") {
    return null;
  }

  const handleSidebarClick = (id: string) => {
    router.push(id);
    setIsMobileOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Brand Header & Navigation */}
      <div>
        {/* App Brand */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-base tracking-tight leading-tight">
              FinTrack
            </span>
            <span className="text-slate-400 text-xs font-medium">
              Expense Analytics
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-8">
          <div className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Overview
          </div>
          <nav className="flex flex-col gap-1.5">
            {SIDEBAR_CONSTANTS.map((item) => {
              const { icon: Icon, title, id } = item;
              const isActive = pathname === id;

              return (
                <button
                  key={id}
                  onClick={() => handleSidebarClick(id)}
                  className={cn(
                    "flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left cursor-pointer group",
                    isActive
                      ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive
                          ? "text-indigo-400"
                          : "text-slate-400 group-hover:text-slate-200"
                      )}
                    />
                    <span>{title}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Section & Logout */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-800/40">
            <img
              src={user.imageUrl || USER_IMAGE}
              alt="User"
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">
                {user.fullName || "Account"}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        )}

        <SignOutButton redirectUrl="/login">
          <button className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 bg-slate-800/50 hover:bg-rose-500/10 transition-all border border-slate-800 hover:border-rose-500/20 cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl bg-slate-900 text-white shadow-md cursor-pointer"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 p-5 transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {navContent}
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen shrink-0 bg-slate-950 border-r border-slate-800/70 p-5">
        {navContent}
      </aside>
    </>
  );
};

export default SideBar;

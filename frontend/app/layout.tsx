import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import SideBar from "@/components/SideBar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FinTrack — Personal Finance & Expense Analytics Platform",
  description:
    "An intuitive, full-stack personal finance and expense tracking platform featuring real-time financial analytics, monthly money-flow trends, and category breakdown reports.",
  keywords: [
    "Expense Tracker",
    "Finance",
    "Budgeting",
    "Analytics",
    "Money Flow",
    "React",
    "Next.js",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col font-sans bg-[#f8fafc] text-slate-900 selection:bg-indigo-500 selection:text-white">
          <div className="h-screen flex overflow-hidden">
            <SideBar />
            <main className="flex-1 h-screen overflow-y-auto bg-[#f8fafc]">
              {children}
            </main>
          </div>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

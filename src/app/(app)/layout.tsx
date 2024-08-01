import { checkAuth } from "@/server/auth";

import { Toaster } from "@/components/ui/sonner";
// import Navbar from "@/components/Navbar";

import Sidebar from "@/components/sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAuth();
  return (
    <main>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 pt-2 md:p-8">
          {/* <Navbar /> */}
          {children}
        </main>
      </div>

      <Toaster richColors />
    </main>
  );
}
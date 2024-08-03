import { getServerAuthSession } from "@/server/auth";

import { Toaster } from "@/components/ui/sonner";
// import Navbar from "@/components/Navbar";

import Sidebar from "@/components/sidebar";

import CheckAuth from "./check-auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session) {
    return <CheckAuth />;
  } else {
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
}

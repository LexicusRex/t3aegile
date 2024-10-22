import { getServerAuthSession } from "@/server/auth";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";

import BreadcrumbPath from "../_components/breadcrumb-path";
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
      <div className="flex h-screen flex-col">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="overflow-x-hidden">
            <header className="sticky -top-full z-20 flex h-auto shrink-0 items-center gap-2 bg-background px-4 py-px pt-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sm:static sm:bg-transparent">
              <div className="flex w-full items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <BreadcrumbPath />
                <div className="relative ml-auto flex-1 md:grow-0">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                  />
                </div>
              </div>
            </header>
            <main className="flex flex-1 flex-col bg-muted/40 dark:bg-muted/30">
              {children}
            </main>
          </SidebarInset>
          <Toaster richColors closeButton />
        </SidebarProvider>
      </div>
    );
  }
}

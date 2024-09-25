import Image from "next/image";

import { getServerAuthSession } from "@/server/auth";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
// import Navbar from "@/components/Navbar";

import Sidebar from "@/components/sidebar";

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
      <div className="flex min-h-screen flex-col">
        <Sidebar />
        {/* <main className="flex-1 overflow-y-auto p-8 pt-2 md:p-8"> */}
        <div className="flex flex-1 flex-col sm:pl-14 sm:pt-4">
          {/* <Navbar /> */}
          <header className="sticky top-0 z-0 flex h-14 items-center gap-4 border-b bg-background px-4 py-px sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            {/* <NavBarMobile /> */}
            <BreadcrumbPath />
            <div className="relative ml-auto flex-1 md:grow-0">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <Image
                    src="/aegile-logo.svg"
                    width={25}
                    height={25}
                    alt="Avatar"
                    className="overflow-hidden rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex flex-1 flex-col bg-muted/40 dark:bg-muted/30">
            {children}
          </main>
        </div>
        <Toaster richColors closeButton />
      </div>
    );
  }
}

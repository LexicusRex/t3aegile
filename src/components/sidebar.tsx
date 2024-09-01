import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import type { Session } from "next-auth";

import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LogoOutline from "@/components/aegile/logo-outline";

import { SidebarFooter, SidebarItems } from "./sidebar-items";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Sidebar = async () => {
  const session = await getServerAuthSession();
  if (session === null) return null;
  return (
    // <aside className="inset-y-0 left-0 z-20 hidden h-screen min-w-14 flex-col border-r bg-background shadow-inner md:block">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider delayDuration={0}>
        <nav className="flex h-full flex-col items-center justify-between gap-4 px-2 sm:py-4">
          <div className="space-y-4">
            <Link
              href="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <LogoOutline className="h-4 w-4 stroke-white transition-all group-hover:scale-110" />
              <span className="sr-only">aegile</span>
            </Link>
            <SidebarItems />
          </div>
          <SidebarFooter />
          {/* <UserDetails session={session} /> */}
        </nav>
      </TooltipProvider>
    </aside>
  );
  // return (
  //   <aside className="hidden h-screen min-w-52 border-r border-border bg-muted p-4 pt-8 shadow-inner md:block">
  //     <div className="flex h-full flex-col justify-between">
  //       <div className="space-y-4">
  //         <h3 className="ml-4 text-lg font-semibold">Logo</h3>
  //         <SidebarItems />
  //       </div>
  //       <UserDetails session={session} />
  //     </div>
  //   </aside>
  // );
};

export default Sidebar;

const UserDetails = ({ session }: { session: Session }) => {
  if (session === null) return null;
  const user = session.user;

  if (!user?.name || user.name.length === 0) return null;

  return (
    <Link href="/account">
      <div className="flex w-full items-center justify-between border-t border-border px-2 pt-4">
        <div className="text-muted-foreground">
          <p className="text-xs">{user.name ?? "John Doe"}</p>
          <p className="pr-4 text-xs font-light">
            {user.email ?? "john@doe.com"}
          </p>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarFallback className="border-2 border-border text-muted-foreground">
            {user.name
              ? user.name
                  ?.split(" ")
                  .map((word) => word?.[0]?.toUpperCase())
                  .join("")
              : "~"}
          </AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
};

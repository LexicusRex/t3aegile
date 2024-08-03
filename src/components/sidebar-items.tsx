"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { LucideIcon } from "lucide-react";

import { additionalLinks, defaultLinks, footerLinks } from "@/config/nav";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const SidebarItems = () => {
  return (
    <>
      <SidebarLinkGroup links={defaultLinks} />
      {additionalLinks.length > 0
        ? additionalLinks.map((l) => (
            <SidebarLinkGroup
              links={l.links}
              // title={l.title}
              border
              key={l.title}
            />
          ))
        : null}
    </>
  );
};

export const SidebarFooter = () => {
  return <SidebarLinkGroup links={footerLinks} />;
};

const SidebarLinkGroup = ({
  links,
  title,
  border,
}: {
  links: SidebarLink[];
  title?: string;
  border?: boolean;
}) => {
  const fullPathname = usePathname();
  const pathname = "/" + fullPathname.split("/")[1];

  return (
    <div className={border ? "my-8 border-t border-border pt-4" : ""}>
      {title ? (
        <h4 className="mb-2 px-2 text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </h4>
      ) : null}
      <div className="flex flex-col gap-4">
        {links.map((link) => (
          <SidebarLink
            key={link.title}
            link={link}
            active={pathname === link.href}
          />
        ))}
      </div>
    </div>
  );
};
const SidebarLink = ({
  link,
  active,
}: {
  link: SidebarLink;
  active: boolean;
}) => {
  return (
    <Tooltip key={"navbar-" + link.title.toLowerCase()}>
      <TooltipTrigger asChild>
        <Link
          href={link.href}
          className={`flex h-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 ${
            // active ? "font-semibold text-primary" : ""
            active ? "bg-accent text-accent-foreground" : ""
          }`}
        >
          <div className="flex items-center justify-start">
            <div
              className={cn(
                "absolute left-0 h-9 w-[4px] rounded-r-lg bg-primary opacity-0",
                active ? "opacity-100" : "",
              )}
            />
            <link.icon className="h-5 w-5" />
            {/* <span className="ml-2 mr-2 text-sm">{link.title}</span> */}
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{link.title}</TooltipContent>
    </Tooltip>
  );

  // return (
  //   <Link
  //     href={link.href}
  //     className={`group inline-block w-full rounded-md p-2 text-xs text-muted-foreground transition-colors hover:bg-popover hover:text-primary hover:shadow ${
  //       active ? "font-semibold text-primary" : ""
  //     }`}
  //   >
  //     <div className="flex items-center">
  //       <div
  //         className={cn(
  //           "absolute left-0 h-6 w-[4px] rounded-r-lg bg-primary opacity-0",
  //           active ? "opacity-100" : "",
  //         )}
  //       />
  //       <link.icon className="mr-1 h-3.5" />
  //       <span>{link.title}</span>
  //     </div>
  //   </Link>
  // );
};

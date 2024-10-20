"use client";

import { usePathname } from "next/navigation";

import { ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const fullPathname = usePathname();
  const pathname = "/" + fullPathname.split("/")[1];
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isGroupActive =
            pathname === item.url ||
            item.items?.some((item) => pathname === item.url);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive ?? isGroupActive}
            >
              <SidebarMenuItem>
                <div
                  className={cn(
                    "absolute -left-2 h-7 w-[4px] rounded-r-lg bg-primary opacity-0",
                    isGroupActive ? "opacity-100" : "",
                  )}
                />
                <SidebarMenuButton
                  asChild
                  size="sm"
                  tooltip={item.title}
                  isActive={isGroupActive}
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubItemActive = pathname === subItem.url;
                          return (
                            <SidebarMenuSubItem
                              key={subItem.title}
                              className="flex items-center"
                            >
                              <div
                                className={cn(
                                  "absolute left-0 h-5 w-[3px] rounded-r-lg bg-primary opacity-0",
                                  isSubItemActive ? "opacity-25" : "",
                                )}
                              />
                              <SidebarMenuSubButton
                                asChild
                                size="sm"
                                className="w-full"
                                // isActive={isSubItemActive}
                              >
                                <a
                                  href={subItem.url}
                                  className={cn(
                                    "font-light",
                                    isSubItemActive && "underline",
                                  )}
                                >
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

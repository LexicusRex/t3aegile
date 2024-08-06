"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { capitalize } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BreadcrumbPath() {
  const pathname = usePathname();
  const paths: string[] = pathname.split("/").filter(Boolean);

  const breadcrumbPage: string | undefined = paths.slice(-1)[0];
  if (!breadcrumbPage) {
    return null;
  }
  const breadcrumbPaths = paths.slice(0, -1);
  const collapsedPaths =
    breadcrumbPaths.length > 2 ? breadcrumbPaths.slice(1, -1) : [];
  const remainingBreadcrumbs =
    breadcrumbPaths.length > 2
      ? breadcrumbPaths.slice(-1)
      : breadcrumbPaths.slice(1);

  // No more that 3 explicit paths.
  // show very first, and the last two, everything in between is collapsed with a dropdown
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbPaths.slice(0, 1).map((path) => (
          <React.Fragment key={0}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/${path}`}>{capitalize(path ?? "")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}

        {collapsedPaths.length > 0 && (
          <React.Fragment key="collapsed">
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {collapsedPaths.map((path, index) => (
                    <DropdownMenuItem key="path">
                      <Link href={`/${paths.slice(0, index + 2).join("/")}`}>
                        {capitalize(path)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        )}
        {remainingBreadcrumbs.map((path, index) => {
          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href={`/${paths.slice(0, index + collapsedPaths.length + 2).join("/")}`}
                  >
                    {capitalize(path)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
        <BreadcrumbPage>{capitalize(breadcrumbPage)}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

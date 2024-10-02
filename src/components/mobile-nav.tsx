"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PanelTopCloseIcon, PanelTopOpenIcon } from "lucide-react";

import { additionalLinks, defaultLinks, footerLinks } from "@/config/nav";
import { cn } from "@/lib/utils";
import LogoOutline from "@/components/aegile/logo-outline";

import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function MobileNav() {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const fullPathname = usePathname();
  const pathname = "/" + fullPathname.split("/")[1];

  const menuRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="flex h-9 w-9 items-center space-x-2 sm:hidden"
        ref={buttonRef}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? (
          <PanelTopCloseIcon className="h-5 w-5" />
        ) : (
          <PanelTopOpenIcon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div
        className={cn(
          "fixed inset-0 top-14 z-40 md:hidden",
          "transition-all duration-300 ease-in-out",
          showMobileMenu
            ? "bg-background/80 opacity-100 backdrop-blur-sm"
            : "pointer-events-none bg-background/0 opacity-0 backdrop-blur-none",
        )}
      />
      {showMobileMenu && (
        <div
          className={cn(
            "fixed inset-0 top-14 z-50 grid h-[calc(100vh-3.5rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-top-80 md:hidden",
            "transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md dark:border"
            ref={menuRef}
          >
            <Link href="/" className="flex items-center space-x-2">
              <LogoOutline className="mr-2 h-6 w-6" />
              Aegile Inc
            </Link>
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {defaultLinks.map((link, index) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`flex w-full items-center justify-start rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline ${
                      // active ? "font-semibold text-primary" : ""
                      active ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    <div
                      className={cn(
                        "absolute left-0 h-9 w-[4px] rounded-r-lg bg-primary opacity-0",
                        active ? "opacity-100" : "",
                      )}
                    />
                    <link.icon className="h-5 w-5" />
                    <span className="ml-2 mr-2 text-sm">{link.title}</span>
                  </Link>
                );
              })}
              <Separator className="my-2" />
              {additionalLinks[0]
                ? additionalLinks[0].links.map((link, index) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={index}
                        href={link.href}
                        className={`flex w-full items-center justify-start rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline ${
                          // active ? "font-semibold text-primary" : ""
                          active ? "bg-accent text-accent-foreground" : ""
                        }`}
                      >
                        <div
                          className={cn(
                            "absolute left-0 h-9 w-[4px] rounded-r-lg bg-primary opacity-0",
                            active ? "opacity-100" : "",
                          )}
                        />
                        <link.icon className="h-5 w-5" />
                        <span className="ml-2 mr-2 text-sm">{link.title}</span>
                      </Link>
                    );
                  })
                : null}
              <Separator className="my-2" />
              {footerLinks.map((link, index) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`flex w-full items-center justify-start rounded-md p-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:underline ${
                      // active ? "font-semibold text-primary" : ""
                      active ? "bg-accent text-accent-foreground" : ""
                    }`}
                  >
                    <div
                      className={cn(
                        "absolute left-0 h-9 w-[4px] rounded-r-lg bg-primary opacity-0",
                        active ? "opacity-100" : "",
                      )}
                    />
                    <link.icon className="h-5 w-5" />
                    <span className="ml-2 mr-2 text-sm">{link.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

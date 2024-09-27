"use client";

import React from "react";

import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function UserSignoutForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "default" }))}
      onClick={async () => {
        setIsLoading(true);
        await signOut({ callbackUrl: "/login" });
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.logout className="mr-2 h-4 w-4" />
      )}{" "}
      Log Out
    </button>
  );
}

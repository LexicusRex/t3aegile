"use client";

import Link from "next/link";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <main className="mx-auto my-4 max-w-lg rounded-lg bg-popover p-10">
      <h1 className="text-center text-2xl font-bold">
        Sign in to your account
      </h1>
      <div className="mt-4">
        {/* <button
          onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
          className="block w-full rounded-lg bg-primary px-4 py-2 text-center font-medium text-primary-foreground hover:opacity-90"
        >
          Sign In
        </button> */}
        <Button asChild className="w-full">
          <Link href="/api/auth/signin/discord">Sign In</Link>
        </Button>
      </div>
    </main>
  );
};

export default Page;

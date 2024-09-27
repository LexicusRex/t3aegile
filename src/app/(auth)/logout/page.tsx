import type { Metadata } from "next";

import LogoOutline from "@/components/aegile/logo-outline";
import { UserSignoutForm } from "@/components/forms/user-signout-form";

import { BackButton } from "./back-button";

export const metadata: Metadata = {
  title: "Logout",
  description: "Logout of your account",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <BackButton />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
          <LogoOutline className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            See you soon!
          </h1>
          <p className="text-sm text-muted-foreground">
            Confirm your sign out action below
          </p>
        </div>
        <UserSignoutForm />
        {/* <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p> */}
      </div>
    </div>
  );
}

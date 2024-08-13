import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";

import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex-1 space-y-4 border border-red-500 p-4 sm:px-6">
      {session?.user ? (
        <pre className="whitespace-break-spaces break-all rounded-sm bg-secondary p-4 text-secondary-foreground shadow-sm">
          {JSON.stringify(session, null, 2)}
        </pre>
      ) : null}
      <Button asChild>
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          {session ? "Sign out" : "Sign in"}
        </Link>
      </Button>
    </main>
  );
}

import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/server/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (session) redirect("/dashboard");

  return <div className="h-screen bg-muted pt-8">{children}</div>;
}

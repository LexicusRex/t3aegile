"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function CheckAuth() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.push(`/api/auth/signin?callbackUrl=${pathname}`);
  }, [pathname, router]);
  return <>Loading...</>;
}

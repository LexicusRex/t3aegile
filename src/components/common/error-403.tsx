// import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ErrorForbiddenGraphic() {
  return (
    // <div className="flex flex-1 flex-col items-center justify-center space-y-4 bg-gradient-to-r from-[#ffffff] via-[#f1f1f1] to-[#ffffff] dark:bg-gradient-to-r dark:from-[#09090b] dark:via-[#161616] dark:to-[#09090b]">
    <div className="flex flex-1 flex-col items-center justify-center space-y-4">
      {/* <p className="max-w-[500px] text-pretty text-center text-3xl font-light sm:text-4xl">
        you lack the required permissions
      </p> */}
      {/* <div className="flex flex-col items-center">
        <Image
          src="/403-error-forbidden.svg"
          width={500}
          height={500}
          alt="404 Error Forbidden"
        />
        <Button variant="link" asChild>
          <a href="https://storyset.com/web" target="_blank">
            Web illustrations by Storyset
          </a>
        </Button>
      </div> */}
      {/* <h2 className="mb-4 text-[#ff3d3d] dark:font-bold dark:text-[#ff6060]">
        Oops! Looks like you&apos;re not allowed here...
      </h2>
      <h1 className="text-9xl font-bold text-gray-900 dark:text-gray-50">
        403
      </h1>
      <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
        The page you&apos;re looking for requires special permissions.
      </p>
      <Button asChild>
        <Link href="/dashboard" prefetch={false}>
          Return to Dashboard
        </Link>
      </Button> */}
      <div className="mx-auto max-w-md space-y-4 text-center">
        {/* <Image
          src="/placeholder.svg"
          width="300"
          height="300"
          alt="404 Illustration"
          className="mx-auto mb-6"
          style={{ aspectRatio: "300/300", objectFit: "cover" }}
        /> */}
        <h1 className="text-8xl font-bold text-gray-900 dark:text-gray-50">
          403
        </h1>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Oops! You&apos;re not allowed here...
        </h1>
        <p className="mt-4 text-muted-foreground">
          The page you&apos;re looking for requires special permissions.
        </p>
        <Button asChild>
          <Link href="/dashboard" prefetch={false}>
            Return to Dashboard
          </Link>
        </Button>
      </div>
      {/* <div className="flex w-[600px] flex-col items-center space-y-4 rounded-lg border bg-white p-12 text-center shadow-2xl dark:bg-zinc-900">
      </div> */}
    </div>
  );
}

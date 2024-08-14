import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ErrorNotFoundGraphic() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-4">
      {/* <p className="max-w-[500px] text-pretty text-center text-3xl font-light sm:text-4xl">
        oops... page not found
      </p> */}
      {/* <div className="flex flex-col items-center">
        <Image
          src="/403-error-not-found.svg"
          width={500}
          height={500}
          alt="404 Error Not Found"
        />
        <Button variant="link" asChild>
          <a href="https://storyset.com/web" target="_blank">
            Web illustrations by Storyset
          </a>
        </Button>
      </div> */}
      <div className="flex w-[600px] flex-col items-center space-y-4 rounded-lg border bg-white p-12 text-center shadow-2xl dark:bg-zinc-900">
        <h2 className="mb-4 text-lg text-[#ff3d3d] dark:font-bold dark:text-[#ff6060]">
          Oops! Something went wrong.
        </h2>
        <h1 className="text-8xl font-bold text-gray-900 dark:text-gray-50">
          403
        </h1>
        <p className="mb-8 text-lg text-gray-500 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/dashboard" prefetch={false}>
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

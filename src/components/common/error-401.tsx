import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ErrorUnauthorizedGraphic() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-4">
      <p className="max-w-[500px] text-pretty text-center text-3xl font-light sm:text-4xl">
        you are unauthenticated
      </p>
      <div className="flex flex-col items-center">
        <Image
          src="/401-error-unauthorized.svg"
          width={500}
          height={500}
          alt="404 Error Unauthorized"
        />
        <Button variant="link" asChild>
          <Link href="https://storyset.com/web">
            Web illustrations by Storyset
          </Link>
        </Button>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ErrorForbiddenGraphic() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-4">
      {/* <p className="max-w-[500px] text-pretty text-center text-3xl font-light sm:text-4xl">
        you lack the required permissions
      </p> */}
      <div className="flex flex-col items-center">
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
      </div>
    </div>
  );
}

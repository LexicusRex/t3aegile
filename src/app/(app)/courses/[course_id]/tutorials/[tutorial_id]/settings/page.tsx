import { Suspense } from "react";

import { api } from "@/trpc/server";

import { Separator } from "@/components/ui/separator";
import { TutorialForm } from "@/components/forms/tutorials/tutorial-form";
import Loading from "@/app/(app)/loading";

interface TutorialPageProps {
  params: {
    tutorial_id: string;
  };
}

export default async function TutorialSettingsPage({
  params,
}: TutorialPageProps) {
  const { tutorial } = await api.tutorial.getById({ id: params.tutorial_id });

  return (
    <div className="space-y-6 lg:max-w-2xl">
      <div className="space-y-2">
        <h3 className="font-semibold leading-none tracking-tight">General</h3>
        <p className="text-sm text-muted-foreground">
          Edit general information about this tutorial.
        </p>
      </div>
      <Separator />
      <Suspense fallback={<Loading />}>
        <TutorialForm tutorial={tutorial} />
      </Suspense>
    </div>
  );
}

import { api } from "@/trpc/server";

import { Separator } from "@/components/ui/separator";

import ClassesGrid from "./_components/classes-grid";

export default async function TutorialsPage({
  params,
}: {
  params: { course_id: string };
}) {
  const { tutorials } = await api.tutorial.getAllByCourseId({
    courseId: params.course_id,
  });

  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold leading-none tracking-tight">
          Tutorial Classes
        </h2>
        <p className="text-sm text-muted-foreground">
          These are the classes you tutor.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="grid flex-grow grid-cols-1 gap-6 tabular-nums xl:grid-cols-3">
        <ClassesGrid tutorials={tutorials} />
        <div className="border border-cyan-500"></div>
      </div>
    </>
  );
}

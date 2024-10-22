import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import {
  checkCourseEnrolment,
  getCourseById,
} from "@/server/api/crud/courses/queries";
import { getServerAuthSession } from "@/server/auth";

import Protect from "@/components/protect";

interface CourseLayoutProps {
  params: { course_id: string };
  children: ReactNode;
  navbar: ReactNode;
}

export default async function CourseLayout({
  params,
  children,
  navbar,
}: CourseLayoutProps) {
  const session = await getServerAuthSession();

  const isCourseMember = session?.user
    ? await checkCourseEnrolment(session?.user?.id, params.course_id)
    : false;

  const { course } = await getCourseById(params.course_id);
  if (!course) return notFound();
  return (
    <div className="flex flex-1 flex-col">
      <Protect
        courseId={params.course_id}
        // permissionSlug=""
        isMember={isCourseMember}
      >
        <>{navbar}</>
        <main className="flex flex-1 flex-col p-4 pt-6">{children}</main>
      </Protect>
    </div>
  );
}

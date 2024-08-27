import type { ReactNode } from "react";

import { checkCourseEnrolment } from "@/server/api/crud/courses/queries";
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

  return (
    <div className="flex flex-1 flex-col">
      <Protect
        courseId={params.course_id}
        permissionSlug="course:view"
        isMember={isCourseMember}
      >
        <div className="navbar-container">{navbar}</div>
        <main className="flex flex-1 flex-col p-4 pt-6 md:px-10">
          {children}
        </main>
      </Protect>
    </div>
  );
}

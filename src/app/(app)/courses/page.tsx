import { Suspense } from "react";
import { redirect } from "next/dist/server/api-utils";

import {
  getCourses,
  getCoursesByEnrolment,
} from "@/server/api/crud/courses/queries";
import { getServerAuthSession } from "@/server/auth";

import Loading from "../loading";
import CoursesTable from "./_components/courses-table";

// import CourseList from "@/components/courses/CourseList";

export const revalidate = 0;

export default async function CoursesPage() {
  return (
    <main className="flex-1 border border-red-500 p-4 sm:px-6">
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="my-2 text-2xl font-semibold">Courses</h1>
        </div>
        <Courses />
      </div>
    </main>
  );
}

const Courses = async () => {
  const session = await getServerAuthSession();
  if (!session) return null;

  const { courses } = session?.user.isSuperuser
    ? await getCourses()
    : await getCoursesByEnrolment(session?.user.id);
  // console.log("🚀 ~ Courses ~ courses:", courses);
  return (
    <Suspense fallback={<Loading />}>
      {/* <CourseList courses={courses} /> */}
      <CoursesTable courses={courses} />
    </Suspense>
  );
};

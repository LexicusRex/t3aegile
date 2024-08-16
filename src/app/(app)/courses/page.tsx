import { Suspense } from "react";

import {
  getCourses,
  getCoursesByEnrolment,
} from "@/server/api/crud/courses/queries";
import { getServerAuthSession } from "@/server/auth";

import Loading from "../loading";
import CourseCreationDialog from "./_components/course-creation-dialog";
import CoursesTable from "./_components/courses-table";

// import CourseList from "@/components/courses/CourseList";

export const revalidate = 0;

export default async function CoursesPage() {
  return (
    <main className="flex flex-1 flex-col space-y-5 border border-red-500 p-4 sm:px-6">
      <div className="mb-3 space-y-2">
        <h3 className="font-semibold leading-none tracking-tight">Courses</h3>
        <p className="text-sm text-muted-foreground">
          Access your courses and view your coursework.
        </p>
      </div>
      {/* <Separator className="my-6" /> */}
      <Courses />
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
  const isSuperuser = session?.user.isSuperuser;

  return courses.length === 0 ? (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No courses
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {isSuperuser
          ? "Get started by creating a new course."
          : "Please contact your administrator to initialise your enrolment."}
      </p>
      {isSuperuser && (
        <div className="mt-6">
          <CourseCreationDialog />
        </div>
      )}
    </div>
  ) : (
    <Suspense fallback={<Loading />}>
      <CoursesTable courses={courses}>
        {isSuperuser && <CourseCreationDialog />}
      </CoursesTable>
    </Suspense>
  );
  //   {/* <CourseList courses={courses} /> */}
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No courses
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new course.
      </p>
      <div className="mt-6">
        <CourseCreationDialog />
      </div>
    </div>
  );
};

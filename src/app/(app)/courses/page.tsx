import { Suspense } from "react";

import { getCourses } from "@/server/api/crud/courses/queries";

import Loading from "../loading";
import CoursesTable from "./_components/courses-table";

// import CourseList from "@/components/courses/CourseList";

export const revalidate = 0;

export default async function CoursesPage() {
  return (
    <main>
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
  const { courses } = await getCourses();
  // console.log("🚀 ~ Courses ~ courses:", courses);
  return (
    <Suspense fallback={<Loading />}>
      {/* <CourseList courses={courses} /> */}
      <CoursesTable courses={courses} />
    </Suspense>
  );
};

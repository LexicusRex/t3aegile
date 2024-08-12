import Image from "next/image";
import Link from "next/link";

import type { CompleteCourse } from "@/server/db/schema/course";
import { PlusCircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CoursesTable({
  courses,
}: {
  courses: CompleteCourse[];
}) {
  return (
    <div>
      {courses.length === 0 ? (
        <EmptyState />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Term</TableHead>
              <TableHead className="hidden lg:table-cell">Members</TableHead>
              <TableHead className="hidden xl:table-cell">
                Instructors
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Course image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src="/aegile-logo.svg"
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/courses/${course.id}`}
                    className="hover:underline"
                  >
                    {course.name}
                  </Link>
                </TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="outline">{course.isActive}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {course.term}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {/* {course.member_count} */}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {/* {course.instructors} */}
                </TableCell>
                <TableCell>
                  {/* <CourseDropdown course_id={course.id} /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

const Course = ({ course }: { course: CompleteCourse }) => {
  // const optimistic = course.id === "optimistic";
  // const deleting = course.id === "delete";
  // const mutating = optimistic || deleting;
  // const pathname = usePathname();
  // const basePath = pathname.includes("courses")
  //   ? pathname
  //   : pathname + "/courses/";

  return (
    <TableRow key={course.id}>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Course image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src="/aegile-logo.svg"
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">
        <Link href={`/courses/${course.id}`} className="hover:underline">
          {course.name}
        </Link>
      </TableCell>
      <TableCell>{course.code}</TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge variant="outline">{course.isActive}</Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{course.term}</TableCell>
      <TableCell className="hidden lg:table-cell">
        {/* {course.member_count} */}
      </TableCell>
      <TableCell className="hidden xl:table-cell">
        {/* {course.instructors} */}
      </TableCell>
      <TableCell>{/* <CourseDropdown course_id={course.id} /> */}</TableCell>
    </TableRow>
  );
};

const CourseCreationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircleIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create Course
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a course</DialogTitle>
          <DialogDescription>
            Create a new course. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {/* <CourseCreationForm /> */}
      </DialogContent>
    </Dialog>
  );
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

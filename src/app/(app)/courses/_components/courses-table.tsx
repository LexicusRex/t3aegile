"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { CompleteCourse } from "@/server/db/schema/course";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
  BookOpenIcon,
  CalendarIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  children,
}: {
  courses: CompleteCourse[];
  children: React.ReactNode;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(10);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse,
  );

  const pageCount = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex justify-between">
        <div className="relative mb-3 max-w-80">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        {children}
      </div>
      <div className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Term</TableHead>
              <TableHead className="hidden lg:table-cell">Members</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCourses.map((course) => (
              <Course key={course.id} course={course} />
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {indexOfFirstCourse + 1}-
          {Math.min(indexOfLastCourse, filteredCourses.length)} of{" "}
          {filteredCourses.length} courses
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={coursesPerPage.toString()}
              onValueChange={(value: string) => {
                setCoursesPerPage(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={coursesPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-muted-foreground">
            Page {currentPage} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount))
              }
              disabled={currentPage === pageCount}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setCurrentPage(pageCount)}
              disabled={currentPage === pageCount}
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
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
    <TableRow
      key={course.code}
      className="h-16 transition-colors hover:bg-muted/50"
    >
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Course image"
          className="aspect-square rounded-md object-cover"
          height="55"
          src="/aegile-logo.svg"
          width="55"
        />
      </TableCell>
      <TableCell>{course.code}</TableCell>
      <TableCell className="font-medium">
        <Link href={`/courses/${course.id}`} className="hover:underline">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="h-4 w-4 text-primary" />
            <span>{course.name}</span>
          </div>
        </Link>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge variant={course.isActive ? "default" : "secondary"}>
          {course.isActive ? "active" : "archived"}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{course.term}</TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex items-center space-x-1">
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
          <span>{course?.memberCount}</span>
        </div>
      </TableCell>
    </TableRow>
  );
};

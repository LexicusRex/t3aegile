import type db from "@/server/db";

import { courses } from "../schema";
import coursesData from "./data/courses.json";

export default async function seed(db: db) {
  await db.insert(courses).values(coursesData);
}

// { "name": "Web Development", "term": "24T3", "code": "COMP1531" },
// { "name": "Discrete Mathematics", "term": "24T3", "code": "MATH1081" },
// { "name": "Computer Systems", "term": "24T3", "code": "COMP1521" },
// {
//   "name": "Algorithms and Data Structures",
//   "term": "24T3",
//   "code": "COMP2521"
// },
// { "name": "Database Systems", "term": "24T3", "code": "COMP3311" },
// { "name": "Operating Systems", "term": "24T3", "code": "COMP3231" },
// { "name": "Computer Networks", "term": "24T3", "code": "COMP3331" },
// {
//   "name": "Software Engineering Fundamentals",
//   "term": "24T3",
//   "code": "COMP3141"
// },
// { "name": "Artificial Intelligence", "term": "24T3", "code": "COMP3411" },
// { "name": "Computer Graphics", "term": "24T3", "code": "COMP3421" },
// { "name": "Information Security", "term": "24T3", "code": "COMP6441" },
// {
//   "name": "Machine Learning and Data Mining",
//   "term": "24T3",
//   "code": "COMP9444"
// },
// { "name": "Software Construction", "term": "24T3", "code": "COMP3141" },
// {
//   "name": "Software Testing and Security",
//   "term": "24T3",
//   "code": "COMP4141"
// },
// {
//   "name": "Software Architecture and Design",
//   "term": "24T3",
//   "code": "COMP4411"
// },
// {
//   "name": "Software Quality Engineering",
//   "term": "24T3",
//   "code": "COMP6443"
// },
// {
//   "name": "Software Verification and Validation",
//   "term": "24T3",
//   "code": "COMP6442"
// },
// { "name": "Software Construction", "term": "24T3", "code": "COMP3141" }

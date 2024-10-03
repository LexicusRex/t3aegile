import type db from "@/server/db";
import { faker } from "@faker-js/faker";

import { users } from "../schema";

// import usersData from "./data/courses.json";

export default async function seed(db: db) {
  const fakerUsers = Array.from({ length: 50 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
  }));

  // await db.insert(courses).values(usersData);
  await db.insert(users).values(fakerUsers);
}

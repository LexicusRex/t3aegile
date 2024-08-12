import type { ReactNode } from "react";

interface CourseLayoutProps {
  children: ReactNode;
  navbar: ReactNode;
}

export default async function CourseLayout({
  children,
  navbar,
}: CourseLayoutProps) {
  return (
    <>
      <div className="navbar-container">{navbar}</div>
      <main className="flex-1 p-4">{children}</main>
    </>
  );
}

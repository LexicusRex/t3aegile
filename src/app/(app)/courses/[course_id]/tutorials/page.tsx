import Link from "next/link";

export default async function TutorialsPage() {
  return (
    <div className="flex flex-col space-y-4">
      <Link href="tutorials/tut_aoishg3353">Tutorial #1</Link>
      <Link href="tutorials/tut_bpjtih4465">Tutorial #2</Link>
      <Link href="tutorials/tut_cqkuji5576">Tutorial #3</Link>
      <Link href="tutorials/tut_drlvkj6687">Tutorial #4</Link>
      <Link href="tutorials/tut_esmwlk7798">Tutorial #5</Link>
    </div>
  );
}

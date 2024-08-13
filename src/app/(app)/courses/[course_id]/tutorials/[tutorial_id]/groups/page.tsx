import Link from "next/link";

export default async function GroupsPage() {
  return (
    <div className="flex flex-col space-y-4">
      <Link href="groups/grp_aoishg3353">Group #1</Link>
      <Link href="groups/grp_bpjtih4465">Group #2</Link>
      <Link href="groups/grp_cqkuji5576">Group #3</Link>
      <Link href="groups/grp_drlvkj6687">Group #4</Link>
      <Link href="groups/grp_esmwlk7798">Group #5</Link>
    </div>
  );
}

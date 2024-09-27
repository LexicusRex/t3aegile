export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen">{children}</div>;
}

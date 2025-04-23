import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/");
  }

  return <>{children}</>;
}

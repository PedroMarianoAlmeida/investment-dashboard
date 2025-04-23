import { getServerSession } from "next-auth/next";
import { authOptions }    from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log("from dashboard",{ session });
  return <div>Dashboard</div>;
}

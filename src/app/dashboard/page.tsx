import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authConfig";

import { getUserData } from "@/services/dbService";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const data = await getUserData();
  console.log({ data });
  return <div>Dashboard</div>;
}

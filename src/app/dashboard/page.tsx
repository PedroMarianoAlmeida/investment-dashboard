import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/authConfig";

import { getWalletFromUser } from "@/services/dbService";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const data = await getWalletFromUser();
  console.log({ data });
  return <div>Dashboard</div>;
}

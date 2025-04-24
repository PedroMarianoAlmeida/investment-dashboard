import { getUserData } from "@/services/dbService";

import { WalletSection } from "@/components/wallets/wallet-section";

export default async function DashboardPage() {
  const data = await getUserData();
  if (!data.success) return <p>Error fetching data</p>;
  const {
    data: { assets, wallets },
  } = data.result;

  return (
    <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
      <WalletSection assets={assets} wallets={wallets} />

      {/* Add all assets table, and maybe a nice chart */}
    </div>
  );
}

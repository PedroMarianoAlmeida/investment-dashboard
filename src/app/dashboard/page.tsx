import { getUserData } from "@/services/dbService";

import { WalletSection } from "@/components/wallets/wallet-section";

export default async function DashboardPage() {
  const data = await getUserData();
  if (!data.success) return <p>Error fetching data</p>;
  const {
    data: { assets, wallets },
  } = data.result;

  return (
    <main className="p-4">
      <WalletSection assets={assets} wallets={wallets} />

      {/* Add all assets table, and maybe a nice chart */}
    </main>
  );
}

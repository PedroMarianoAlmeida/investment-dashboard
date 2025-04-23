import { getUserData } from "@/services/dbService";
import { getWallets } from "@/services/walletService";

import { WalletSection } from "@/components/wallets/wallet-section";

export default async function DashboardPage() {
  const data = await getUserData();
  if (!data.success) return <p>Error fetching data</p>;
  const {
    data: { assets, wallets },
  } = data.result;

  const walletsTreated = getWallets({ assets, wallets });
  return (
    <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
      <WalletSection wallets={walletsTreated} />
    </div>
  );
}

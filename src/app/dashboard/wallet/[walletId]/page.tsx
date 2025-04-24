import { getUserData } from "@/services/dbService";
import { AssetSection } from "@/components/assets/assets-section";

interface WalletDetailsPageProps {
  params: Promise<{ walletId: string }>;
}

export default async function WalletDetailsPage({
  params,
}: WalletDetailsPageProps) {
  const { walletId } = await params;
  const data = await getUserData();
  if (!data.success) return <p>Error fetching data</p>;
  const {
    data: { assets, wallets },
  } = data.result;
  return (
    <main className="p-4">
      <AssetSection
        selectedWallet={walletId}
        assets={assets}
        wallets={wallets}
      />
    </main>
  );
}

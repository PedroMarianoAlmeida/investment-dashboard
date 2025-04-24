import { getUserData } from "@/services/dbService";
import { AssetSection } from "@/components/assets/assets-section";

interface WalletDetailsPageProps {
  params: { walletId: string };
}

export default async function WalletDetailsPage({
  params,
}: WalletDetailsPageProps) {
  const walletId = params.walletId;
  const data = await getUserData();
  if (!data.success) return <p>Error fetching data</p>;
  const {
    data: { assets, wallets },
  } = data.result;
  return (
    <div>
      <AssetSection
        selectedWallet={walletId}
        assets={assets}
        wallets={wallets}
      />
    </div>
  );
}

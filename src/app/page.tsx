import { WalletSection } from "@/components/wallets/wallet-section";
import { AssetSection } from "@/components/assets/assets-section";
import { getTest } from "@/services/dbService";

interface HomeProps {
  searchParams: Promise<{ selected?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { selected } = await searchParams;
  const data = await getTest();
  console.log({ data });

  return (
    <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
      <WalletSection />
      <AssetSection walletName={selected} />
    </div>
  );
}

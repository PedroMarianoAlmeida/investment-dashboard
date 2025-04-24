import { WalletTable } from "@/components/wallets/wallet-table";
import { Section } from "@/components/layout/section";
import { getWallets } from "@/services/walletService";
import { WalletAndAssetDataFromDb } from "@/types/wallet";
import { NewWallet } from "@/components/wallets/actions/new-wallet";
import { WalletBarChart } from "@/components/wallets/wallet-bar-chart";

export const WalletSection = ({
  assets,
  wallets,
}: WalletAndAssetDataFromDb) => {
  const walletsTreated = getWallets({ assets, wallets });

  return (
    <Section title="Wallets" id="wallets-heading">
      <div className="flex flex-col gap-2">
        <WalletTable wallets={walletsTreated} />
        <NewWallet />
        <WalletBarChart />
      </div>
    </Section>
  );
};

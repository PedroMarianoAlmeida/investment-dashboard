import { WalletTable } from "@/components/wallets/wallet-table";
import { Section } from "@/components/layout/section";
import { getWallets } from "@/services/walletService";
import { WalletAndAssetDataFromDb } from "@/types/wallet";
import { NewWallet } from "@/components/wallets/actions/new-wallet";
import { WalletBarChart } from "@/components/wallets/charts/wallet-bar-chart";
import { WalletPieChart } from "@/components/wallets/charts/wallet-pie-chart";

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
        {walletsTreated.length !== 0 && (
          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
            <WalletBarChart wallets={walletsTreated} />
            <WalletPieChart wallets={walletsTreated} />
          </div>
        )}
      </div>
    </Section>
  );
};

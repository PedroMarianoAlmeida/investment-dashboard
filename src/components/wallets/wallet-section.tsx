import { WalletTable } from "@/components/wallets/wallet-table";
import { Section } from "@/components/layout/section";
import { ClearFilter } from "./clear-filter";
import { getWallets, GetWalletParams } from "@/services/walletService";

interface WalletSectionProps extends GetWalletParams {}

export const WalletSection = ({ assets, wallets }: WalletSectionProps) => {
  const walletsTreated = getWallets({ assets, wallets });
  return (
    <Section title="Wallets" id="wallets-heading">
      <div className="flex flex-col gap-2">
        <WalletTable wallets={walletsTreated} />
        <ClearFilter />
      </div>
    </Section>
  );
};

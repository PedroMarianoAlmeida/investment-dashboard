import { getWallets } from "@/services/walletService";
import { WalletTable } from "@/components/wallets/wallet-table";
import { Section } from "@/components/layout/section";
import { ClearFilter } from "./clear-filter";

export const WalletSection = () => {
  const wallets = getWallets();

  return (
    <Section title="Wallets" id="wallets-heading">
      <div className="flex flex-col gap-2">
        <WalletTable wallets={wallets} />
        <ClearFilter />
      </div>
    </Section>
  );
};

import { WalletTable } from "@/components/wallets/wallet-table";
import { Section } from "@/components/layout/section";
import { ClearFilter } from "./clear-filter";
import { getWallets, GetWalletParams } from "@/services/walletService";

export const WalletSection = ({ assets, wallets }: GetWalletParams) => {
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

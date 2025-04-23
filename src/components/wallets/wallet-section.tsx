import { WalletTable } from "@/components/wallets/wallet-table";
import { Section } from "@/components/layout/section";
import { ClearFilter } from "./clear-filter";
import { Wallet } from "@/types/wallet";

interface WalletSectionProps {
  wallets: Omit<Wallet, "assets">[];
}

export const WalletSection = ({ wallets }: WalletSectionProps) => {
  return (
    <Section title="Wallets" id="wallets-heading">
      <div className="flex flex-col gap-2">
        <WalletTable wallets={wallets} />
        <ClearFilter />
      </div>
    </Section>
  );
};

import { getWallets } from "@/services/walletService";
import { WalletTable } from "@/components/wallets/wallet-table";
import { Section } from "@/components/layout/section";

export const WalletSection = () => {
  const wallets = getWallets();

  return (
    <Section title="Wallets" id="wallets-heading">
      <WalletTable wallets={wallets} />
    </Section>
  );
};

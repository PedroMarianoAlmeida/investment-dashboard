import { getAssetsFromWallet } from "@/services/walletService";
import { Section } from "@/components/layout/section";
import { AssetsTable } from "@/components/assets/assets-table";

export const AssetSection = ({ walletName }: { walletName?: string }) => {
  if (!walletName)
    return (
      <Section title="Assets" id="assets-heading">
        <p>Select a Wallet</p>
      </Section>
    );
  const wallets = getAssetsFromWallet(walletName);

  if (!wallets.success) return <p>Invalid Wallet</p>;

  return (
    <Section title="Assets" id="assets-heading">
      <AssetsTable assets={wallets.assets} />
    </Section>
  );
};

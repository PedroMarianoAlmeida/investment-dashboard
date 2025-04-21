import { getAssetsFromWallet } from "@/services/walletService";
import { Section } from "@/components/layout/section";

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
      <p>{walletName}</p>
    </Section>
  );
};

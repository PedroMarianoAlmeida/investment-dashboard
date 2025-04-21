import { getWallets } from "@/services/walletService";
import { WalletTable } from "@/components/wallets/wallet-table";

export const WalletSection = () => {
  const wallets = getWallets();

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Wallets</h2>
      <WalletTable wallets={wallets} />
    </section>
  );
};

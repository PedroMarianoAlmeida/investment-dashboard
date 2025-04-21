import { WalletSection } from "@/components/wallets/wallet-section";

export default function Home() {
  return (
    <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
      <WalletSection />
    </div>
  );
}

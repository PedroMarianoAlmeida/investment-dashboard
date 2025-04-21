import { WalletSection } from "@/components/wallets/wallet-section";

interface HomeProps {
  searchParams: { selected?: string };
}

export default function Home({ searchParams: { selected } }: HomeProps) {
  console.log({ selected });
  return (
    <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
      <WalletSection />
    </div>
  );
}

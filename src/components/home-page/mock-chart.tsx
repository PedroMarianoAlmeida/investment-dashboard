"use client";
import { WalletBarChart } from "@/components/wallets/charts/wallet-bar-chart";
import { WalletWithId } from "@/types/wallet";

const mockWallets: WalletWithId[] = [
  {
    id: "wallet-1",
    walletName: "Risky",
    currentAmount: 2_500,
    spentAmount: 2_000,
    profitLoss: 500,
    assets: [],
  },
  {
    id: "wallet-2",
    walletName: "Retirement",
    currentAmount: 32_000,
    spentAmount: 30_000,
    profitLoss: 2_000,
    assets: [],
  },
  {
    id: "wallet-3",
    walletName: "Summer Trip",
    currentAmount: 4_000,
    spentAmount: 3_500,
    profitLoss: 500,
    assets: [],
  },
];

export const MockChart = () => {
  return <WalletBarChart wallets={mockWallets} />;
};

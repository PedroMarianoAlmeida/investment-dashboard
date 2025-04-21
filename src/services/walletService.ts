import rawData from "@/data/portfolio.json";
import { Wallet } from "@/types/wallet";

const portfolio = rawData as Wallet[];

export function getWallets(): Omit<Wallet, "assets">[] {
  return portfolio.map(({ assets, ...rest }) => rest);
}

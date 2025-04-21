import rawData from "@/data/portfolio.json";
import { Wallet, Asset } from "@/types/wallet";

const portfolio = rawData as Wallet[];

export function getWallets(): Omit<Wallet, "assets">[] {
  return portfolio.map(({ assets: _assets, ...rest }) => rest);
}

interface AssetsFromWalletReturnSuccess {
  success: true;
  assets: Asset[];
}

interface AssetsFromWalletReturnFail {
  success: false;
}
export function getAssetsFromWallet(
  wallet: string
): AssetsFromWalletReturnSuccess | AssetsFromWalletReturnFail {
  const walletSelected = portfolio.find(
    ({ walletName }) => wallet === walletName
  );
  if (!walletSelected) return { success: false };
  return { assets: walletSelected.assets, success: true };
}

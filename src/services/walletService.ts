import rawData from "@/data/portfolio.json";
import { Wallet, Asset, AssetFromDb, WalletFromDb } from "@/types/wallet";

const portfolio = rawData as Wallet[];

interface GetWalletParams {
  assets: Map<string, AssetFromDb>;
  wallets: Map<string, WalletFromDb>;
}
export function getWallets({
  assets: assetMap,
  wallets: walletMap,
}: GetWalletParams): Omit<Wallet, "assets">[] {
  return Array.from(walletMap.values()).map((walletDb) => {
    // 1) Merge per-wallet asset entries (symbol, quantity, purchasePrice)
    //    with the global assetMap (name, type, currentPrice).
    const fullAssets: Asset[] = walletDb.assets.map(
      ({ symbol, quantity, purchasePrice }) => {
        const db = assetMap.get(symbol);
        if (!db) {
          throw new Error(`Missing asset data for symbol "${symbol}"`);
        }
        return {
          symbol,
          type: db.type,
          name: db.name,
          quantity,
          purchasePrice,
          currentPrice: db.currentPrice,
        };
      }
    );

    // 2) Compute totals
    const currentAmount = fullAssets.reduce(
      (sum, a) => sum + a.currentPrice * a.quantity,
      0
    );
    const spentAmount = fullAssets.reduce(
      (sum, a) => sum + a.purchasePrice * a.quantity,
      0
    );
    const profitLoss = currentAmount - spentAmount;

    return {
      walletName: walletDb.name,
      currentAmount,
      spentAmount,
      profitLoss,
    };
  });
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

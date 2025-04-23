import { Wallet, Asset, WalletAndAssetDataFromDb, AssetType } from "@/types/wallet";

export function getWallets({
  assets: assetMap,
  wallets: walletMap,
}: WalletAndAssetDataFromDb): Omit<Wallet, "assets">[] {
  return Array.from(walletMap.values()).map((walletDb) => {
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

    const currentAmount = fullAssets.reduce((sum, a) => sum + a.currentPrice * a.quantity, 0);
    const spentAmount = fullAssets.reduce((sum, a) => sum + a.purchasePrice * a.quantity, 0);
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
  selectedWalletId: string;
  assets: Asset[];
  otherWalletsAssets: { type: AssetType; symbol: string; name: string }[];
}

interface AssetsFromWalletReturnFail {
  success: false;
}

interface GetAssetsFromWalletParams extends WalletAndAssetDataFromDb {
  selectedWallet: string;
}

export function getAssetsFromWallet({
  assets: assetMap,
  wallets: walletMap,
  selectedWallet,
}: GetAssetsFromWalletParams): AssetsFromWalletReturnSuccess | AssetsFromWalletReturnFail {
  // 1) Find the wallet entry ID and data whose .name matches selectedWallet
  const entry = Array.from(walletMap.entries()).find(([, w]) => w.name === selectedWallet);
  if (!entry) {
    return { success: false };
  }
  const [selectedWalletId, walletDb] = entry;

  // 2) Rehydrate each asset for the selected wallet
  const fullAssets: Asset[] = walletDb.assets.map(({ symbol, quantity, purchasePrice }) => {
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
  });

  // 3) Determine which assets exist in assetMap but are not held in the selected wallet
  const selectedSymbols = new Set(fullAssets.map((a) => a.symbol));
  const otherWalletsAssets = Array.from(assetMap.entries())
    .filter(([symbol]) => !selectedSymbols.has(symbol))
    .map(([symbol, db]) => ({
      type: db.type,
      symbol,
      name: db.name,
    }));

  return {
    success: true,
    selectedWalletId,
    assets: fullAssets,
    otherWalletsAssets,
  };
}

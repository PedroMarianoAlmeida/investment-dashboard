import {
  Wallet,
  Asset,
  WalletAndAssetDataFromDb,
  AssetType,
} from "@/types/wallet";

export function getWallets({
  assets: assetMap,
  wallets: walletMap,
}: WalletAndAssetDataFromDb): Omit<Wallet, "assets">[] {
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
}: GetAssetsFromWalletParams):
  | AssetsFromWalletReturnSuccess
  | AssetsFromWalletReturnFail {
  // 1) Find the wallet entry whose .name matches selectedWallet
  const walletDb = Array.from(walletMap.values()).find(
    (w) => w.name === selectedWallet
  );
  if (!walletDb) {
    return { success: false };
  }

  // 2) Rehydrate each asset for the selected wallet
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
    assets: fullAssets,
    otherWalletsAssets,
  };
}

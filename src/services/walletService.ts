import {
  Asset,
  WalletAndAssetDataFromDb,
  AssetType,
  WalletWithId,
  OtherWalletsAssets,
} from "@/types/wallet";

export function getWallets({
  assets: assetMap,
  wallets: walletMap,
}: WalletAndAssetDataFromDb): WalletWithId[] {
  return Array.from(walletMap.entries()).map(([walletId, walletDb]) => {
    // Rehydrate each asset for this wallet
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

    // Compute totals
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
      id: walletId,
      walletName: walletDb.name,
      currentAmount,
      spentAmount,
      profitLoss,
      assets: fullAssets, // ← include the assets here
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
  selectedWallet, // now the wallet’s ID
}: GetAssetsFromWalletParams):
  | AssetsFromWalletReturnSuccess
  | AssetsFromWalletReturnFail {
  // 1) Grab the WalletFromDb by its ID
  const walletDb = walletMap.get(selectedWallet);
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

  // 3) Assets in assetMap but not in the selected wallet
  const held = new Set(fullAssets.map((a) => a.symbol));
  const otherWalletsAssets: OtherWalletsAssets["otherWalletsAssets"] =
    Array.from(assetMap.entries())
      .filter(([symbol]) => !held.has(symbol))
      .map(([symbol, db]) => ({
        type: db.type,
        symbol,
        name: db.name,
      }));

  return {
    success: true,
    selectedWalletId: selectedWallet,
    assets: fullAssets,
    otherWalletsAssets,
  };
}

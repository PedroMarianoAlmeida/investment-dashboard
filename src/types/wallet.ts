export type AssetType = "stock" | "crypto";

export interface Asset {
  type: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
}

export interface Wallet {
  walletName: string;
  currentAmount: number;
  spentAmount: number;
  profitLoss: number;
  assets: Asset[];
}

export interface WalletFromDb {
  name: Asset["name"];
  assets: Pick<Asset, "symbol" | "quantity" | "purchasePrice">[];
}

export interface AssetFromDb
  extends Pick<Asset, "currentPrice" | "name" | "type"> {}

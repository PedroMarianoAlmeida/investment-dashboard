import { z } from "zod";
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

export type AssetOnWallet = Pick<
  Asset,
  "symbol" | "quantity" | "purchasePrice"
>;

export interface WalletFromDb {
  name: Asset["name"];
  assets: AssetOnWallet[];
}

export type AssetFromDb = Pick<Asset, "currentPrice" | "name" | "type">;

export interface WalletAndAssetDataFromDb {
  assets: Map<string, AssetFromDb>;
  wallets: Map<string, WalletFromDb>;
}

export interface OtherWalletsAssets {
  otherWalletsAssets: Pick<Asset, "name" | "symbol" | "type">[];
}

export const editAssetIntoWalletFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  type: z.union([z.literal("stock"), z.literal("crypto")]),
  currentPrice: z.number().min(0),
  purchasePrice: z.number().min(0),
  quantity: z.number().min(0),
});

export type EditAssetForm = z.infer<typeof editAssetIntoWalletFormSchema>;

export interface WalletWithIdWithoutAssets extends Omit<Wallet, "assets"> {
  id: string;
}

import { database } from "@/config/databaseConfig";
import { authOptions } from "@/config/authConfig";
import {
  collection,
  doc,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { WalletFromDb, AssetFromDb } from "@/types/wallet";

export const walletConverter: FirestoreDataConverter<WalletFromDb> = {
  toFirestore(wallet) {
    return { name: wallet.name, assets: wallet.assets };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>) {
    const data = snapshot.data();
    return {
      name: data.name,
      assets: data.assets,
    };
  },
};

export const assetConverter: FirestoreDataConverter<AssetFromDb> = {
  toFirestore(asset) {
    return {
      name: asset.name,
      type: asset.type,
      currentPrice: asset.currentPrice,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>) {
    const data = snapshot.data();
    return {
      name: data.name,
      type: data.type,
      currentPrice: data.currentPrice,
    };
  },
};

export const getUserId = async (): Promise<string> => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }
  return session.user.id;
};

export const getUserWalletsCollection = async () => {
  const userId = await getUserId();
  return collection(database, "users", userId, "wallets").withConverter(
    walletConverter
  );
};

export const getUserWalletDoc = async (walletId: string) => {
  return doc(await getUserWalletsCollection(), walletId).withConverter(
    walletConverter
  );
};

export const getUserAssetsCollection = async () => {
  const userId = await getUserId();
  return collection(database, "users", userId, "assets").withConverter(
    assetConverter
  );
};

export const getUserAssetDoc = async (assetSymbol: string) => {
  return doc(await getUserAssetsCollection(), assetSymbol).withConverter(
    assetConverter
  );
};

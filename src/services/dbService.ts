import { getServerSession } from "next-auth/next";
import {
  collection,
  getDocs,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import { database } from "@/config/databaseConfig";
import { authOptions } from "@/config/authConfig";
import { asyncWrapper } from "@/helpers/asyncWrapper";

import { WalletFromDb, AssetFromDb } from "@/types/wallet";

const walletConverter: FirestoreDataConverter<WalletFromDb> = {
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

const assetConverter: FirestoreDataConverter<AssetFromDb> = {
  toFirestore(asset) {
    // If you ever .set() or .add() an AssetFromDb
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

export const getUserData = async () => {
  return asyncWrapper(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("No session");

    const userId = session.user.id;

    // — Wallets —
    const rawWalletsCol = collection(database, "users", userId, "wallets");
    const walletsCol = rawWalletsCol.withConverter(walletConverter);
    const walletsSnap = await getDocs(walletsCol);
    const wallets = new Map<string, WalletFromDb>();
    walletsSnap.docs.forEach((docSnap) => {
      wallets.set(docSnap.id, docSnap.data());
    });

    // — Assets —
    const rawAssetsCol = collection(database, "users", userId, "assets");
    const assetsCol = rawAssetsCol.withConverter(assetConverter);
    const assetsSnap = await getDocs(assetsCol);
    const assets = new Map<string, AssetFromDb>();
    assetsSnap.docs.forEach((docSnap) => {
      assets.set(docSnap.id, docSnap.data());
    });

    return { data: { wallets, assets } };
  });
};

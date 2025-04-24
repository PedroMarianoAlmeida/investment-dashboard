"use server";
import { getServerSession } from "next-auth/next";
import { revalidatePath } from "next/cache";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";

import { database } from "@/config/databaseConfig";
import { authOptions } from "@/config/authConfig";
import { asyncWrapper } from "@/helpers/asyncWrapper";

import { WalletFromDb, AssetFromDb, AssetOnWallet } from "@/types/wallet";

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

interface AddExistentAssetInNewWalletParams {
  asset: AssetOnWallet;
  wallet: string;
}

export const addExistentAssetInNewWallet = async ({
  asset,
  wallet,
}: AddExistentAssetInNewWalletParams) => {
  return asyncWrapper(async () => {
    // 1) Auth
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("No session");
    const userId = session.user.id;

    // 2) Point at the user's wallet doc
    const walletDocRef = doc(
      database,
      "users",
      userId,
      "wallets",
      wallet
    ).withConverter(walletConverter);

    // 3) Fetch current wallet data
    const walletSnap = await getDoc(walletDocRef);
    if (!walletSnap.exists())
      throw new Error(`Wallet "${wallet}" not found for user ${userId}`);

    const walletData = walletSnap.data();

    // 4) Check for existing symbol
    const alreadyHas = walletData.assets.some((a) => a.symbol === asset.symbol);
    if (alreadyHas) {
      // you can choose to throw or just return
      throw new Error(
        `Asset "${asset.symbol}" is already in wallet "${wallet}"`
      );
    }

    // 5) Append via arrayUnion
    await updateDoc(walletDocRef, {
      assets: arrayUnion(asset),
    });

    revalidatePath("/dashboard");
    return { success: true };
  });
};

interface AddNewAssetInNewWalletProps {
  assetDbData: AssetFromDb;
  assetOnWallet: AssetOnWallet;
  wallet: string;
}
export const addNewAssetInNewWallet = async ({
  assetDbData,
  assetOnWallet,
  wallet,
}: AddNewAssetInNewWalletProps) => {
  return asyncWrapper(async () => {
    // 1) Auth
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("No session");
    const userId = session.user.id;

    // 2) Prepare the asset-doc ref (use symbol as ID)
    const assetDocRef = doc(
      database,
      "users",
      userId,
      "assets",
      assetOnWallet.symbol
    ).withConverter(assetConverter);

    // 3) Check if the asset already exists
    const assetSnap = await getDoc(assetDocRef);
    if (assetSnap.exists()) {
      throw new Error(
        `Asset "${assetOnWallet.symbol}" already exists in your assets.`
      );
    }

    // 4) Write the new asset into users/{userId}/assets
    await setDoc(assetDocRef, assetDbData);

    // 5) Now point at the wallet doc
    const walletDocRef = doc(
      database,
      "users",
      userId,
      "wallets",
      wallet
    ).withConverter(walletConverter);

    // 6) Ensure the wallet exists
    const walletSnap = await getDoc(walletDocRef);
    if (!walletSnap.exists()) {
      throw new Error(`Wallet "${wallet}" not found for user ${userId}`);
    }

    // 7) Append the new-on-wallet entry
    await updateDoc(walletDocRef, {
      assets: arrayUnion(assetOnWallet),
    });

    revalidatePath("/dashboard");
    return { success: true };
  });
};

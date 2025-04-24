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
  deleteDoc,
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

const getUserId = async (): Promise<string> => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Authentication required");
  }
  return session.user.id;
};

export const getUserData = async () => {
  return asyncWrapper(async () => {
    const userId = await getUserId();
    const walletsCol = collection(
      database,
      "users",
      userId,
      "wallets"
    ).withConverter(walletConverter);
    const walletsSnap = await getDocs(walletsCol);
    const wallets = new Map<string, WalletFromDb>();
    walletsSnap.docs.forEach((docSnap) => {
      wallets.set(docSnap.id, docSnap.data());
    });
    const assetsCol = collection(
      database,
      "users",
      userId,
      "assets"
    ).withConverter(assetConverter);
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
    const userId = await getUserId();

    const walletDocRef = doc(
      database,
      "users",
      userId,
      "wallets",
      wallet
    ).withConverter(walletConverter);

    const walletSnap = await getDoc(walletDocRef);
    if (!walletSnap.exists())
      throw new Error(`Wallet "${wallet}" not found for user ${userId}`);

    const walletData = walletSnap.data();

    const alreadyHas = walletData?.assets?.some(
      (a) => a.symbol === asset.symbol
    );
    if (alreadyHas) {
      throw new Error(
        `Asset "${asset.symbol}" is already in wallet "${wallet}"`
      );
    }

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
    const userId = await getUserId();

    const assetDocRef = doc(
      database,
      "users",
      userId,
      "assets",
      assetOnWallet.symbol
    ).withConverter(assetConverter);

    const assetSnap = await getDoc(assetDocRef);
    if (assetSnap.exists()) {
      throw new Error(
        `Asset "${assetOnWallet.symbol}" already exists in your assets.`
      );
    }

    await setDoc(assetDocRef, assetDbData);

    const walletDocRef = doc(
      database,
      "users",
      userId,
      "wallets",
      wallet
    ).withConverter(walletConverter);

    const walletSnap = await getDoc(walletDocRef);
    if (!walletSnap.exists()) {
      throw new Error(`Wallet "${wallet}" not found for user ${userId}`);
    }

    await updateDoc(walletDocRef, {
      assets: arrayUnion(assetOnWallet),
    });

    revalidatePath("/dashboard");
    return { success: true };
  });
};

interface EditAssetInWalletProps {
  wallet: string;
  symbol: string;
  assetOnWallet?: Partial<Pick<AssetOnWallet, "purchasePrice" | "quantity">>;
  assetDbData?: Partial<Pick<AssetFromDb, "name" | "type" | "currentPrice">>;
}

export const editAssetInWallet = async ({
  wallet,
  symbol,
  assetOnWallet,
  assetDbData,
}: EditAssetInWalletProps) => {
  return asyncWrapper(async () => {
    const userId = await getUserId();

    if (assetDbData) {
      const assetDocRef = doc(
        database,
        "users",
        userId,
        "assets",
        symbol
      ).withConverter(assetConverter);
      await updateDoc(assetDocRef, assetDbData);
    }

    if (assetOnWallet) {
      const walletDocRef = doc(
        database,
        "users",
        userId,
        "wallets",
        wallet
      ).withConverter(walletConverter);

      const snap = await getDoc(walletDocRef);
      if (!snap.exists()) throw new Error(`Wallet "${wallet}" not found`);

      const data = snap.data();
      const updatedAssets = data?.assets?.map((item) =>
        item.symbol === symbol ? { ...item, ...assetOnWallet } : item
      );

      if (updatedAssets) {
        await updateDoc(walletDocRef, { assets: updatedAssets });
      }
    }

    revalidatePath("/dashboard");
    return { success: true };
  });
};

interface DeleteAssetFromWalletProps {
  wallet: string;
  symbol: string;
}
export const deleteAssetFromWallet = async ({
  symbol,
  wallet,
}: DeleteAssetFromWalletProps) => {
  return asyncWrapper(async () => {
    const userId = await getUserId();

    const walletDocRef = doc(
      database,
      "users",
      userId,
      "wallets",
      wallet
    ).withConverter(walletConverter);

    const walletSnap = await getDoc(walletDocRef);
    if (!walletSnap.exists()) {
      throw new Error(`Wallet "${wallet}" not found for user ${userId}`);
    }
    const walletData = walletSnap.data();

    const updatedAssets = walletData?.assets?.filter(
      (a) => a.symbol !== symbol
    );

    if (updatedAssets) {
      await updateDoc(walletDocRef, { assets: updatedAssets });
    }

    revalidatePath("/dashboard");
    return { success: true };
  });
};

export const createEmptyWallet = async (walletName: string) => {
  return asyncWrapper(async () => {
    const userId = await getUserId();

    const walletsCol = collection(
      database,
      "users",
      userId,
      "wallets"
    ).withConverter(walletConverter);

    const newWalletRef = doc(walletsCol);

    await setDoc(newWalletRef, {
      name: walletName,
      assets: [],
    });

    revalidatePath("/dashboard");

    return { success: true, walletId: newWalletRef.id };
  });
};

export const deleteWallet = async (walletId: string) => {
  return asyncWrapper(async () => {
    const userId = await getUserId();

    const walletDocRef = doc(
      database,
      "users",
      userId,
      "wallets",
      walletId
    ).withConverter(walletConverter);

    await deleteDoc(walletDocRef);

    revalidatePath("/dashboard");

    return { success: true };
  });
};

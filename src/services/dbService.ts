"use server";
import { revalidatePath } from "next/cache";
import {
  getDocs,
  getDoc,
  updateDoc,
  arrayUnion,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { asyncWrapper } from "@/helpers/asyncWrapper";
import {
  getUserAssetsCollection,
  getUserAssetDoc,
  getUserWalletDoc,
  getUserWalletsCollection,
} from "@/helpers/firebase";

import { WalletFromDb, AssetFromDb, AssetOnWallet } from "@/types/wallet";

export const getUserData = async () => {
  return asyncWrapper(async () => {
    const [walletsCol, assetsCol] = await Promise.all([
      getUserWalletsCollection(),
      getUserAssetsCollection(),
    ]);

    const [walletsSnap, assetsSnap] = await Promise.all([
      getDocs(walletsCol),
      getDocs(assetsCol),
    ]);

    const wallets = new Map<string, WalletFromDb>(
      walletsSnap.docs.map((doc) => [doc.id, doc.data()])
    );
    const assets = new Map<string, AssetFromDb>(
      assetsSnap.docs.map((doc) => [doc.id, doc.data()])
    );

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
    const walletDocRef = await getUserWalletDoc(wallet);
    const walletSnap = await getDoc(walletDocRef);
    if (!walletSnap.exists()) throw new Error(`Wallet "${wallet}" not found`);

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
    const assetDocRef = await getUserAssetDoc(assetOnWallet.symbol);
    const assetSnap = await getDoc(assetDocRef);
    if (assetSnap.exists()) {
      throw new Error(
        `Asset "${assetOnWallet.symbol}" already exists in your assets.`
      );
    }

    await setDoc(assetDocRef, assetDbData);

    const walletDocRef = await getUserWalletDoc(wallet);
    const walletSnap = await getDoc(walletDocRef);
    if (!walletSnap.exists()) {
      throw new Error(`Wallet "${wallet}" not found`);
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
    if (assetDbData) {
      const assetDocRef = await getUserAssetDoc(symbol);
      await updateDoc(assetDocRef, assetDbData);
    }

    if (assetOnWallet) {
      const walletDocRef = await getUserWalletDoc(wallet);
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
    const walletDocRef = await getUserWalletDoc(wallet);
    const walletSnap = await getDoc(walletDocRef);
    if (!walletSnap.exists()) {
      throw new Error(`Wallet "${wallet}" not found`);
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
    const walletsCol = await getUserWalletsCollection();
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
    const walletDocRef = await getUserWalletDoc(walletId);
    await deleteDoc(walletDocRef);

    revalidatePath("/dashboard");

    return { success: true };
  });
};

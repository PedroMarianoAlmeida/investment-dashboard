import { getServerSession } from "next-auth/next";
import {
  collection,
  doc,
  getDocs,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  getDoc,
} from "firebase/firestore";

import { database } from "@/config/databaseConfig";
import { authOptions } from "@/config/authConfig";
import { asyncWrapper } from "@/helpers/asyncWrapper";

import { WalletFromDb } from "@/types/wallet";

export const getTest = () => {
  return asyncWrapper(async () => {
    const docRef = doc(database, "test", "Uo6tGAeMv3OdwPL5j8PS");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Document not founded");
    const data = docSnap.data();

    return { data };
  });
};

// 1) Define how to go to/from Firestore
const walletConverter: FirestoreDataConverter<WalletFromDb> = {
  toFirestore(wallet) {
    // when you later .add() or .set() a WalletFromDb, this is used
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

export const getUserData = async () => {
  return asyncWrapper(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("No session");

    const userId = session.user.id;
    // 2) grab the “raw” collection reference
    const rawCol = collection(database, "users", userId, "wallets");
    // 3) attach your converter
    const walletsCol = rawCol.withConverter(walletConverter);

    const snap = await getDocs(walletsCol); // → QuerySnapshot<WalletFromDb>
    const wallets = new Map<string, WalletFromDb>();
    snap.docs.forEach((docSnap) => {
      wallets.set(docSnap.id, docSnap.data());
    });

    return { data: wallets };
  });
};

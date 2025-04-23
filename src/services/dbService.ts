import { getServerSession } from "next-auth/next";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { database } from "@/config/databaseConfig";
import { authOptions } from "@/config/authConfig";
import { asyncWrapper } from "@/helpers/asyncWrapper";

export const getTest = () => {
  return asyncWrapper(async () => {
    const docRef = doc(database, "test", "Uo6tGAeMv3OdwPL5j8PS");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Document not founded");
    const data = docSnap.data();

    return { data };
  });
};

export const getUserData = async () => {
  return asyncWrapper(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("No session");

    const {
      user: { id },
    } = session;

    const walletsCollection = collection(database, "users", id, "wallets");
    const assetsCollection = collection(database, "users", id, "assets");

    const snapshot = await getDocs(walletsCollection);

    const wallets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    return { data: wallets };
  });
};

import { getServerSession } from "next-auth/next";
import { doc, getDoc } from "firebase/firestore";

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

export const getWalletFromUser = async () => {
  return asyncWrapper(async () => {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("No session");

    const {
      user: { id },
    } = session;

    const docRef = doc(database, `users`, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("Document not founded");
    const data = docSnap.data();

    return { data };
  });
};

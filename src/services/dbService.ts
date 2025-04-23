import { doc, getDoc } from "firebase/firestore";

import { database } from "@/config/databaseConfig";
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

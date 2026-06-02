import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  addDoc
} from "firebase/firestore";

export default async function handler(req, res) {
  const colRef = collection(db, "products");

  if (req.method === "GET") {
    const snapshot = await getDocs(colRef);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    const data = req.body;

    const docRef = await addDoc(colRef, data);

    return res.status(201).json({
      message: "Product saved",
      id: docRef.id
    });
  }
}

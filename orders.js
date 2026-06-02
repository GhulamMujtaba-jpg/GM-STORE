import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";

export default async function handler(req, res) {
  const colRef = collection(db, "orders");

  if (req.method === "GET") {
    const snapshot = await getDocs(colRef);
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json(orders);
  }

  if (req.method === "POST") {
    const order = req.body;

    const docRef = await addDoc(colRef, order);

    return res.status(201).json({
      message: "Order placed",
      id: docRef.id
    });
  }
}

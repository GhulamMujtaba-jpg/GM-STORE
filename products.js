let products = [
  {
    id: 1,
    name: "T-Shirt",
    price: 1200,
    image: "/shirt.jpg"
  },
  {
    id: 2,
    name: "Shoes",
    price: 3500,
    image: "/shoes.jpg"
  }
];

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json(products);
  }

  if (req.method === "POST") {
    const newProduct = req.body;
    products.push(newProduct);
    res.status(201).json({ message: "Product added", products });
  }
}

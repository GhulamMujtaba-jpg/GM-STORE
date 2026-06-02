import { useEffect, useState } from "react";

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div className="container">
      <h1>Shop</h1>

      {products.map(p => (
        <div key={p.id} className="card">
          <h2>{p.name}</h2>
          <p>Price: {p.price}</p>
        </div>
      ))}
    </div>
  );
}

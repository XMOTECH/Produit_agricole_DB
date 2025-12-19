import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Liste des produits</h2>
      <table border="1">
        <thead>
          <tr><th>ID</th><th>Nom</th><th>Prix</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p[0]}>
              <td>{p[0]}</td>
              <td>{p[1]}</td>
              <td>{p[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function ProductChart() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then(res => {
        // Transformer les données Oracle en format Recharts
        const formatted = res.data.map(p => ({
          id: p[0],
          name: p[1],
          price: p[2]
        }));
        setProducts(formatted);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>Prix des Produits Agricoles</h2>
      <ResponsiveContainer>
        <BarChart data={products}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="price" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductChart;

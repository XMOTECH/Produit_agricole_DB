import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RevenuePieChart = ({ data }) => {
    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '1.1rem' }}>Revenue Distribution by Product</h3>
            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60} // Creates the Donut effect
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="VALUE"
                            nameKey="NOM_PRODUIT"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenuePieChart;
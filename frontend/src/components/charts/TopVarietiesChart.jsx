import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopVarietiesChart = ({ data }) => {
    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '1.1rem' }}>Top 5 Profitable Varieties</h3>
            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="NOM_VARIETE"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="TOTAL_CA" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#16a34a' : '#3b82f6'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TopVarietiesChart;
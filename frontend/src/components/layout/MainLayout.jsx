import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children, title }) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Sidebar />
            <Header title={title} />
            <main style={{ marginLeft: '260px', padding: '30px' }}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
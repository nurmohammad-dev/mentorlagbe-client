import Hero from '@/components/shared/Hero';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            <Hero />
            {children}
        </div>
    );
};

export default RootLayout;
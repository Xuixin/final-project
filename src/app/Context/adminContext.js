'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const AdminContext = createContext();

export default function AdminProvider({ children }) {
    const router = useRouter();

    const login = async (token) => {
        localStorage.setItem('admin', token);
        router.push('POS')
    };

    const logout = () => {
        localStorage.removeItem('admin');
        setAdmin(null);
        router.push('/POS');
    };

    return (
        <AdminContext.Provider value={{ login, logout }}>
            {children}
        </AdminContext.Provider>
    );
}

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('AdminProvider must be used within an AdminProvider');
    }
    return context;
};

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    return JSON.parse(jsonPayload);
}

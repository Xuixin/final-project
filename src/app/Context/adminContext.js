'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export const AdminContext = createContext();

export default function AdminProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('admin');

        if (token) {
            const { id } = parseJwt(token);

            axios
                .get(`/api/employee/emp/${id}`)
                .then((response) => {
                    const data = response.data;
                    if (data.error) {
                        console.error(data.error);
                    } else {
                        setAdmin(data);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching admin:', err);
                });
        }
    }, []);

    const login = async (token) => {
        localStorage.setItem('admin', token);
        const { id } = parseJwt(token);

        try {
            const response = await axios.get(`/api/employee/emp/${id}`);
            const data = response.data;
            if (data.error) {
                console.error(data.error);
            } else {
                setAdmin(data);
                router.push('/POS');
            }
        } catch (err) {
            console.error('Error fetching admin:', err);
        }
    };

    const logout = () => {
        localStorage.removeItem('admin');
        setAdmin(null);
        router.push('/POS');
    };

    return (
        <AdminContext.Provider value={{ admin, login, logout }}>
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

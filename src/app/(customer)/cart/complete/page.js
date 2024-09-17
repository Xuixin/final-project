"use client"
// src/app/complete/page.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CompletePage() {
    const router = useRouter();

    const updatePaymentStatus = async () => {
        const orderId = await localStorage.getItem('orderId'); // ใช้ 'orderId' เป็น key ของ localStorage
        if (orderId) {
            await axios.put(`/api/payment/${orderId}`, { status: 'Completed' })
                .then(() => alert('Payment success'))
                .catch((err) => console.error(err));
        } else {
            console.error('Order ID not found in localStorage');
        }
    }


    useEffect(() => {
        updatePaymentStatus()
        router.push('/menu')
    }, [router]);

    return <div>Processing payment...</div>;
}

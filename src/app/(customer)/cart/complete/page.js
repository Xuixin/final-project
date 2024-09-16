"use client"
// src/app/complete/page.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppContext } from '@/app/Context/AppContext';

export default function CompletePage() {
    const router = useRouter();
    const { orderId } = useAppContext()

    const updatePaymentStatus = async () => {
        await axios.put(`/api/payment/${orderId}`, { status: 'Completed' })
            .then(() => alert('Payment success'))
            .catch((err) => console.error(err))
    }

    useEffect(() => {
        updatePaymentStatus()
        router.push('/menu')
    }, [router]);

    return <div>Processing payment...</div>;
}

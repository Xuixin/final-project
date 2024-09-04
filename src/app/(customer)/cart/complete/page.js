"use client"
// src/app/complete/page.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompletePage() {
    const router = useRouter();

    useEffect(() => {
        // ตรวจสอบสถานะคำสั่งซื้อที่หน้าการจัดการการชำระเงิน
        async function checkPaymentStatus() {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (token) {
                try {
                    const response = await fetch(`/api/payment/complete?token=${token}`);
                    const data = await response.json();

                    if (response.ok && data.success) {
                        router.push('/menu'); // รีไดเร็กไปที่ /menu หากการชำระเงินสำเร็จ
                    } else {
                        // จัดการกรณีที่การชำระเงินไม่สำเร็จ
                        alert('Payment failed');
                    }
                } catch (error) {
                    console.error('Error checking payment status:', error.message);
                }
            } else {
                alert('Token is missing');
            }
        }

        checkPaymentStatus();
    }, [router]);

    return <div>Processing payment...</div>;
}

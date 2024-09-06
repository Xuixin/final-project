"use client"
// src/app/complete/page.js

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompletePage() {
    const router = useRouter();

    useEffect(() => {
        alert('payment complete')
        router.push('/menu')
    }, [router]);

    return <div>Processing payment...</div>;
}

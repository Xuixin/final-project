'use client'
import { QRProvider } from "./qrContext";
export default function QrLayout({ children }) {
    return (
        <QRProvider>
            <main className="bg-primary-foreground">
                {children}
            </main>
        </QRProvider>
    );
}
'use client'; // Ensures this component is client-side rendered

import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from 'next/navigation';
import React from 'react'; // Ensure React is imported

const Bread = () => {
    const pathname = usePathname(); // Directly use pathname

    // Example breadcrumb generation logic
    const pathnames = pathname.split('/').filter(x => x);
    const breadcrumbItems = pathnames.map((_, index) => {
        const href = `/${pathnames.slice(0, index + 1).join('/')}`;
        // Convert to lowercase and capitalize each word for label
        const label = pathnames[index].replace(/-/g, ' ').toLowerCase(); 
        return { href, label };
    });

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/">Home</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {breadcrumbItems.map(({ href, label }, index) => (
                    <React.Fragment key={href}>
                        <BreadcrumbItem>
                            {index < breadcrumbItems.length - 1 ? (
                                <BreadcrumbLink asChild>
                                    <Link href={href}>{label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Bread;

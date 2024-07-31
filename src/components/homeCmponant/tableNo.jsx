import React from 'react';
import { Button } from "../ui/button"; // Adjust the path as necessary

// TableButton Component
function TableButton({ num, status }) {
    // Set background and border color based on the status prop
    const buttonClasses = status
        ? 'bg-white text-black border-red-500 hover:bg-red-200 ' // Status true: white background with black border and text
        : 'bg-white  text-black border-green-500 hover:bg-green-200'; // Status false: green background with green border and white text

    return (
        <Button className={`h-[150px] w-[150px] border ${buttonClasses}`}>
            <span>{num}</span>
        </Button>
    );
}

// Tables Component
export default function Tables() {
    const table = [
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
        {
            id: 1,
            No: 'T1',
            status: true
        },
        {
            id: 2,
            No: 'T2',
            status: true
        },
        {
            id: 3,
            No: 'O1',
            status: false
        },
        {
            id: 4,
            No: 'O1',
            status: false
        },
    ];

    return (
        <div className='w-[1240px] border h-screen max-h-[750px]  overflow-auto grid grid-cols-6 gap-4 gap-y-5 pl-10'>
            {table.map((item) => (
                <TableButton key={item.id} num={item.No} status={item.status} />
            ))}
        </div>
    );
}

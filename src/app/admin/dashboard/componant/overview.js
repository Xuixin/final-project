"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    {
        name: "Nov",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "a",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "3",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "b",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "2",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "c",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `B${value}`}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}

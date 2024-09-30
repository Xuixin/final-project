"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"

const chartConfig = {
    income: {
        label: "Income",
        color: "#4ade80", // สีเขียว
    },
    expense: {
        label: "Expense",
        color: "#f87171", // สีแดง
    },
}

export function Overview() {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/overview")
                setChartData(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchData()
    }, [])

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill={chartConfig.income.color} radius={4} />
                <Bar dataKey="expense" fill={chartConfig.expense.color} radius={4} />
            </BarChart>
        </ChartContainer>
    )
}

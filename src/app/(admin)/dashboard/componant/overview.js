'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"

const chartConfig = {
    income: {
        label: "Income",
        color: "#4ade80",
    },
    expense: {
        label: "Expense",
        color: "#f87171",
    },
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 shadow-lg rounded-lg border">
                <p className="text-gray-600 font-medium mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.fill }}
                        />
                        <span className="text-gray-700 font-medium">
                            {entry.name}:
                        </span>
                        <span className="text-gray-900">
                            RM {entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

export function Overview() {
    const [chartData, setChartData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/overview")
                setChartData(response.data)
                setError(null)
            } catch (error) {
                console.error(error)
                setError("Failed to load chart data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <p className="text-sm text-gray-500">Loading chart data...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-2">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-sm text-blue-500 hover:text-blue-600"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-[400px] bg-white p-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        className="stroke-gray-200"
                    />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        className="text-gray-600"
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `RM ${value}`}
                        className="text-gray-600"
                    />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        wrapperStyle={{
                            paddingBottom: "20px"
                        }}
                    />
                    <Bar
                        name="Income"
                        dataKey="income"
                        fill={chartConfig.income.color}
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                    <Bar
                        name="Expense"
                        dataKey="expense"
                        fill={chartConfig.expense.color}
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
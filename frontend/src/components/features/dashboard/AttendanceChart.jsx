"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "T2", present: 238, absent: 7 },
  { day: "T3", present: 240, absent: 5 },
  { day: "T4", present: 235, absent: 10 },
  { day: "T5", present: 242, absent: 3 },
  { day: "T6", present: 236, absent: 9 },
  { day: "T7", present: 230, absent: 15 },
]

const chartConfig = {
  present: {
    label: "Có mặt",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Vắng mặt",
    color: "hsl(var(--chart-2))",
  },
}

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống Kê Điểm Danh</CardTitle>
        <CardDescription>Tuần này (20/01 - 26/01/2026)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="present" fill="var(--color-present)" radius={4} />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

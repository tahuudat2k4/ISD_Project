import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, BookOpen, Users, AlertCircle } from "lucide-react"

export function ScheduleStats({ stats }) {
  const items = [
    {
      title: "Tổng tiết dạy",
      value: stats.totalPeriods || 0,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Số lớp",
      value: stats.totalClasses || 0,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Tiết trống",
      value: stats.freePeriods || 0,
      icon: BookOpen,
      color: "text-orange-600",
    },
    {
      title: "Xung đột",
      value: stats.conflicts || 0,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <item.icon className={cn("size-4", item.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DoorOpen, TrendingUp } from "lucide-react"

export function BudClassStats({ stats }) {
  const items = [
    {
      title: "Tổng lớp",
      value: stats.total || 0,
      icon: DoorOpen,
      color: "text-blue-600",
    },
    {
      title: "Tổng học sinh",
      value: stats.totalStudents || 0,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Trung bình/lớp",
      value: stats.averagePerClass ? stats.averagePerClass.toFixed(1) : "0.0",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
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

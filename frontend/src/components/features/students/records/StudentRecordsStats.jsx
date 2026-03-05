import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, CheckCircle } from "lucide-react"

export function StudentRecordsStats({ stats }) {
  const items = [
    {
      title: "Tổng học sinh",
      value: stats.total || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Điểm trung bình",
      value: stats.averageScore ? stats.averageScore.toFixed(1) : "0.0",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Xuất sắc",
      value: stats.excellent || 0,
      icon: CheckCircle,
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

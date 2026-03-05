import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, CheckCircle2, Clock, TrendingUp } from "lucide-react"

export function EvaluationStats({ stats }) {
  const items = [
    {
      title: "Tổng giáo viên",
      value: stats.totalTeachers || 0,
      icon: Award,
      color: "text-blue-600",
    },
    {
      title: "Đã đánh giá",
      value: stats.completed || 0,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "Chưa đánh giá",
      value: stats.pending || 0,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Điểm TB",
      value: stats.averageScore ? stats.averageScore.toFixed(1) : "0.0",
      icon: TrendingUp,
      color: "text-purple-600",
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenText, CalendarCheck, Clock } from "lucide-react"

export function LessonsStats({ stats }) {
  const items = [
    {
      title: "Tổng bài giảng",
      value: stats.total || 0,
      icon: BookOpenText,
      color: "text-blue-600",
    },
    {
      title: "Đang dạy",
      value: stats.inProgress || 0,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Hoàn thành",
      value: stats.completed || 0,
      icon: CalendarCheck,
      color: "text-green-600",
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

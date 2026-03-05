import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, AlertCircle } from "lucide-react"

export function StudentHealthStats({ stats }) {
  const items = [
    {
      title: "Tổng học sinh",
      value: stats.total || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Khỏe mạnh",
      value: stats.healthy || 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Cần chú ý",
      value: stats.needsAttention || 0,
      icon: AlertCircle,
      color: "text-orange-600",
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

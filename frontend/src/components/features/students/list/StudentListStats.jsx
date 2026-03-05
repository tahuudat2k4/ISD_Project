import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react"

export function StudentListStats({ stats }) {
  const items = [
    {
      title: "Tổng học sinh",
      value: stats.total || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Học sinh nam",
      value: stats.male || 0,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Học sinh nữ",
      value: stats.female || 0,
      icon: UserX,
      color: "text-pink-600",
    },
    {
      title: "Trung bình/lớp",
      value: stats.averagePerClass ? stats.averagePerClass.toFixed(1) : "0.0",
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

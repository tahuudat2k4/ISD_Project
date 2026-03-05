import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivities() {
  const activities = [
    {
      id: 1,
      type: "absent",
      title: "Học sinh vắng mặt",
      description: "Nguyễn Văn A - Lớp Mầm 1A",
      time: "Hôm nay",
      status: "Có phép",
    },
    {
      id: 2,
      type: "birthday",
      title: "Sinh nhật",
      description: "Trần Thị B - Lớp Mầm 2B",
      time: "Ngày mai",
      status: "Sắp tới",
    },
    {
      id: 3,
      type: "event",
      title: "Sự kiện",
      description: "Họp phụ huynh cuối kỳ",
      time: "3 ngày nữa",
      status: "Quan trọng",
    },
    {
      id: 4,
      type: "absent",
      title: "Học sinh vắng mặt",
      description: "Lê Văn C - Lớp Mầm 3A",
      time: "Hôm nay",
      status: "Không phép",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt Động Gần Đây</CardTitle>
        <CardDescription>Cập nhật mới nhất trong ngày</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b pb-3 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>
                    {activity.type === "absent" && "V"}
                    {activity.type === "birthday" && "🎂"}
                    {activity.type === "event" && "📅"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    activity.status === "Có phép" || activity.status === "Sắp tới"
                      ? "secondary"
                      : activity.status === "Quan trọng"
                      ? "default"
                      : "destructive"
                  }
                >
                  {activity.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

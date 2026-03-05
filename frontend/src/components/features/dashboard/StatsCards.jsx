import * as React from "react"
import { Users, GraduationCap, Building2, UserCheck } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { teacherService } from "@/services/teacherService"

export function StatsCards() {
  const [teacherCount, setTeacherCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTeacherCount = async () => {
      try {
        setLoading(true)
        const res = await teacherService.getTeachers()
        const count = res?.data?.length || 0
        setTeacherCount(count)
      } catch (error) {
        console.error("Error fetching teacher count:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeacherCount()
  }, [])

  const stats = [
    {
      title: "Tổng Học Sinh",
      value: "245",
      description: "Đang học tập",
      icon: GraduationCap,
      color: "text-blue-600",
    },
    {
      title: "Tổng Giáo Viên",
      value: loading ? "..." : teacherCount.toString(),
      description: "Đang công tác",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Số Lớp Học",
      value: "12",
      description: "Đang hoạt động",
      icon: Building2,
      color: "text-purple-600",
    },
    {
      title: "Điểm Danh Hôm Nay",
      value: "98.5%",
      description: "236/240 học sinh",
      icon: UserCheck,
      trend: "4 học sinh vắng mặt",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

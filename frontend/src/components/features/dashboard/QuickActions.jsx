import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  UserPlus,
  UserCheck,
  BookOpenCheck,
  Trophy 
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      title: "Điểm Danh",
      description: "Điểm danh nhanh cho lớp học",
      icon: UserCheck,
      color: "bg-blue-500",
      url: "/attendance",
    },
    {
      title: "Thêm Học Sinh",
      description: "Đăng ký học sinh mới",
      icon: UserPlus,
      color: "bg-green-500",
      url: "/students",
    },
    {
      title: "Bài Giảng",
      description: "Xem và quản lý bài giảng",
      icon: BookOpenCheck ,
      color: "bg-orange-500",
      url: "/lessons",
    },
    {
      title: "Xếp loại",
      description: "Quản lý xếp loại học sinh",
      icon: Trophy ,
      color: "bg-purple-500",
      url: "/evaluation",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao Tác Nhanh</CardTitle>
        <CardDescription>Các chức năng thường dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex-col items-start p-4 text-left whitespace-normal"
                onClick={() => navigate(action.url)}
              >
                <div className={`mb-2 rounded-lg ${action.color} p-2`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="font-semibold text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {action.description}
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

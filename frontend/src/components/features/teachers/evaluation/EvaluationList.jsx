import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Eye } from "lucide-react"

function getInitials(name) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase()
}

function getScoreBadge(score) {
  if (score >= 9) {
    return <Badge className="bg-green-500">Xuất sắc</Badge>
  } else if (score >= 8) {
    return <Badge className="bg-blue-500">Tốt</Badge>
  } else if (score >= 7) {
    return <Badge className="bg-yellow-500">Khá</Badge>
  } else if (score >= 5) {
    return <Badge variant="secondary">Trung bình</Badge>
  } else {
    return <Badge variant="destructive">Cần cải thiện</Badge>
  }
}

function TeacherCard({ teacher, onEvaluate, onViewDetails, canEvaluateTeachers }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Avatar>
            <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{teacher.name}</div>
            <div className="text-xs text-muted-foreground">{teacher.role}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {teacher.classes.join(", ")}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {teacher.status === "completed" ? (
            <>
              {getScoreBadge(teacher.score)}
              <span className="text-lg font-bold text-primary">{teacher.score}/10</span>
            </>
          ) : (
            <Badge variant="outline">Chưa đánh giá</Badge>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {teacher.status === "completed" ? (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(teacher)}
          >
            <Eye className="size-3.5 mr-1" />
            Xem chi tiết
          </Button>
        ) : canEvaluateTeachers ? (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onEvaluate(teacher)}
          >
            <FileText className="size-3.5 mr-1" />
            Đánh giá
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            disabled
          >
            Chờ admin đánh giá
          </Button>
        )}
      </div>
    </div>
  )
}

export function EvaluationList({ teachers, onEvaluate, onViewDetails, canEvaluateTeachers }) {
  if (!teachers || teachers.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">Không tìm thấy giáo viên</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Danh sách giáo viên</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            onEvaluate={onEvaluate}
            onViewDetails={onViewDetails}
            canEvaluateTeachers={canEvaluateTeachers}
          />
        ))}
      </CardContent>
    </Card>
  )
}

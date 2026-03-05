import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, User } from "lucide-react"

function getStatusBadge(status) {
  if (status === "Đang dạy") {
    return <Badge className="bg-orange-500">Đang dạy</Badge>
  } else if (status === "Sắp tới") {
    return <Badge className="bg-blue-500">Sắp tới</Badge>
  } else {
    return <Badge className="bg-green-500">Đã hoàn thành</Badge>
  }
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="size-4 text-muted-foreground mt-0.5" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value || "Chưa cập nhật"}</div>
      </div>
    </div>
  )
}

export function LessonsDetails({ open, onOpenChange, lesson }) {
  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bài giảng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{lesson.title}</div>
                <div className="text-xs text-muted-foreground">{lesson.code}</div>
              </div>
              <div className="text-right">{getStatusBadge(lesson.status)}</div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{lesson.className}</Badge>
              <Badge variant="secondary">{lesson.topic}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4">
                <InfoRow icon={Calendar} label="Ngày" value={lesson.date} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <InfoRow icon={Clock} label="Thời lượng" value={lesson.duration} />
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-2">
            <InfoRow icon={User} label="Giáo viên" value={lesson.teacher} />
            <InfoRow icon={MapPin} label="Phòng học" value={lesson.room} />
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3 text-sm">Mục tiêu bài giảng</h3>
            <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
              {lesson.objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3 text-sm">Dụng cụ học tập</h3>
            <div className="flex flex-wrap gap-2">
              {lesson.materials.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2 text-sm">Ghi chú</h3>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">{lesson.notes}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { User, DoorOpen, Calendar } from "lucide-react"

function getStatusBadge(status) {
  if (status === "Hoạt động") {
    return <Badge className="bg-green-500">Hoạt động</Badge>
  } else if (status === "Tạm dừng") {
    return <Badge className="bg-orange-500">Tạm dừng</Badge>
  } else {
    return <Badge variant="secondary">Kế hoạch</Badge>
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

export function BudClassDetails({ open, onOpenChange, budClass }) {
  if (!budClass) return null

  const capacityPercent = (budClass.currentStudents / budClass.capacity) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết lớp học</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{budClass.name}</div>
                <div className="text-xs text-muted-foreground">{budClass.code}</div>
              </div>
              <div className="text-right">
                {getStatusBadge(budClass.status)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{budClass.description}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-medium text-sm">Thông tin sức chứa</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground mb-2">Sức chứa</div>
                  <div className="text-2xl font-bold">{budClass.capacity}</div>
                  <div className="text-xs text-muted-foreground mt-1">học sinh</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground mb-2">Hiện có</div>
                  <div className="text-2xl font-bold">{budClass.currentStudents}</div>
                  <div className="text-xs mt-1">
                    <Badge variant="outline">{capacityPercent.toFixed(0)}%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3 text-sm">Đội ngũ giảng dạy</h3>
            <div className="space-y-2">
              <InfoRow icon={User} label="Giáo viên chủ nhiệm" value={budClass.mainTeacher} />
              <InfoRow icon={User} label="Giáo viên phụ trợ" value={budClass.assistantTeacher} />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3 text-sm">Thông tin lớp học</h3>
            <div className="space-y-2">
              <InfoRow icon={DoorOpen} label="Phòng học" value={budClass.room} />
              <InfoRow icon={Calendar} label="Giờ học" value={budClass.schedule} />
              <InfoRow icon={Calendar} label="Ngày thành lập" value={budClass.established} />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-3 text-sm">Cơ sở vật chất</h3>
            <div className="flex flex-wrap gap-2">
              {budClass.facilities.map((facility) => (
                <Badge key={facility} variant="secondary">
                  {facility}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2 text-sm">Ghi chú</h3>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">{budClass.notes}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

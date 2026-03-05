import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, User, DoorOpen, Calendar } from "lucide-react"

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

export function GermClassDetails({ open, onOpenChange, germClass }) {
  if (!germClass) return null

  const capacityPercent = (germClass.currentStudents / germClass.capacity) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết lớp học</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Header Info */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{germClass.name}</div>
                <div className="text-xs text-muted-foreground">{germClass.code}</div>
              </div>
              <div className="text-right">
                {getStatusBadge(germClass.status)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{germClass.description}</p>
          </div>

          <Separator />

          {/* Capacity Info */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Thông tin sức chứa</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground mb-2">Sức chứa</div>
                  <div className="text-2xl font-bold">{germClass.capacity}</div>
                  <div className="text-xs text-muted-foreground mt-1">học sinh</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground mb-2">Hiện có</div>
                  <div className="text-2xl font-bold">{germClass.currentStudents}</div>
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

          {/* Staff Info */}
          <div>
            <h3 className="font-medium mb-3 text-sm">Đội ngũ giảng dạy</h3>
            <div className="space-y-2">
              <InfoRow icon={User} label="Giáo viên chủ nhiệm" value={germClass.mainTeacher} />
              <InfoRow icon={User} label="Giáo viên phụ trợ" value={germClass.assistantTeacher} />
            </div>
          </div>

          <Separator />

          {/* Class Details */}
          <div>
            <h3 className="font-medium mb-3 text-sm">Thông tin lớp học</h3>
            <div className="space-y-2">
              <InfoRow icon={DoorOpen} label="Phòng học" value={germClass.room} />
              <InfoRow icon={Calendar} label="Giờ học" value={germClass.schedule} />
              <InfoRow icon={Calendar} label="Ngày thành lập" value={germClass.established} />
            </div>
          </div>

          <Separator />

          {/* Facilities */}
          <div>
            <h3 className="font-medium mb-3 text-sm">Cơ sở vật chất</h3>
            <div className="flex flex-wrap gap-2">
              {germClass.facilities.map((facility) => (
                <Badge key={facility} variant="secondary">
                  {facility}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <h3 className="font-medium mb-2 text-sm">Ghi chú</h3>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">{germClass.notes}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Users, User } from "lucide-react"

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

  const capacityPercent = germClass.capacity > 0
    ? (germClass.currentStudents / germClass.capacity) * 100
    : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Chi tiết lớp học</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="border-0 bg-muted/60 shadow-none">
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-bold">{germClass.name}</div>
                    <div className="text-sm text-muted-foreground">{germClass.code}</div>
                  </div>
                  <div className="shrink-0">{getStatusBadge(germClass.status)}</div>
                </div>
                <p className="text-sm text-muted-foreground">{germClass.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="size-4 text-muted-foreground" />
                  Thông tin sức chứa
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Sức chứa</div>
                    <div className="text-2xl font-bold">{germClass.capacity}</div>
                    <div className="text-xs text-muted-foreground">học sinh</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">Hiện có</div>
                    <div className="text-2xl font-bold">{germClass.currentStudents}</div>
                    <div className="mt-1 text-xs">
                      <Badge variant="outline">{capacityPercent.toFixed(0)}%</Badge>
                    </div>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500 transition-all"
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-5">
                <h3 className="text-sm font-medium">Đội ngũ giảng dạy</h3>
                <div className="space-y-3">
                  <InfoRow icon={User} label="Giáo viên chủ nhiệm" value={germClass.mainTeacher} />
                  <InfoRow icon={User} label="Giáo viên phụ trợ" value={germClass.assistantTeacher} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <Card>
              <CardContent className="space-y-3 p-5">
                <h3 className="text-sm font-medium">Ghi chú</h3>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm text-blue-900">{germClass.notes || "Chưa có ghi chú"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-5">
                <h3 className="text-sm font-medium">Cơ sở vật chất</h3>
                {germClass.facilities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {germClass.facilities.map((facility) => (
                      <Badge key={facility} variant="secondary">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Chưa cập nhật cơ sở vật chất</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

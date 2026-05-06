import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Calendar, MapPin, Phone, Heart, GraduationCap, FileText } from "lucide-react"

function getStatusBadgeVariant(status) {
  if (status === "Đang học") {
    return "default"
  }

  if (status === "Nghỉ phép") {
    return "secondary"
  }

  return "destructive"
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

export function StudentListDetails({ open, onOpenChange, student }) {
  if (!student) return null

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Thông tin học sinh</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Header Info with Avatar */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src={student.avatar || "/avatars/placeholder-student.jpg"} alt={student.name} />
                <AvatarFallback className="text-lg font-semibold bg-primary/10">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{student.name}</div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="secondary">{student.code}</Badge>
                <Badge variant="outline">{student.gender}</Badge>
                <Badge variant={getStatusBadgeVariant(student.status)}>{student.status || "Đang học"}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detailed Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <InfoRow icon={Calendar} label="Ngày sinh" value={student.dob} />
              <InfoRow icon={Calendar} label="Ngày nhập học" value={student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString('vi-VN') : "Chưa cập nhật"} />
              <InfoRow icon={MapPin} label="Địa chỉ" value={student.address} />
            </div>
            
            {/* Column 2 */}
            <div className="space-y-4">
              <InfoRow icon={Phone} label="Số điện thoại" value={student.phone} />
              <InfoRow icon={User} label="Trạng thái" value={student.status} />
              <InfoRow icon={Heart} label="Tình trạng sức khỏe" value={student.health} />
              <InfoRow icon={GraduationCap} label="Lớp học" value={student.className} />
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <FileText className="size-4 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">Ghi chú</div>
                <div className="text-sm font-medium">
                  {student.notes || "Không có ghi chú"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

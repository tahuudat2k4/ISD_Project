import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Mail, 
  Phone, 
  BookOpen, 
  Users, 
  Calendar,
  MapPin,
  Award,
  Clock,
  Camera
} from "lucide-react"

export function TeacherDetail({ teacher, open, onOpenChange }) {
  const [avatarPreview, setAvatarPreview] = React.useState(null)
  const fileInputRef = React.useRef(null)

  if (!teacher) return null

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh')
        return
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ảnh không được vượt quá 5MB')
        return
      }
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
        // TODO: Upload to server
        // await uploadAvatar(teacher.id, file)
      }
      reader.readAsDataURL(file)
    }
  }

  // Additional sample data for detail view
  const additionalInfo = {
    schedule: [
      { day: "Thứ 2", time: "7:00 - 11:00", class: "Mầm 1A" },
      { day: "Thứ 3", time: "7:00 - 11:00", class: "Mầm 1A" },
      { day: "Thứ 4", time: "7:00 - 11:00", class: "Mầm 1A" },
      { day: "Thứ 5", time: "13:00 - 17:00", class: "Mầm 1B" },
      { day: "Thứ 6", time: "7:00 - 11:00", class: "Mầm 1A" },
    ]
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[650px] sm:max-w-[650px] overflow-y-auto p-6">
        <SheetHeader className="space-y-3 pb-6 px-1">
          <SheetTitle className="text-2xl font-bold">Thông Tin Giáo Viên</SheetTitle>
          <SheetDescription className="text-base">
            Chi tiết thông tin và lịch làm việc của giáo viên
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-6 px-1">
          {/* Profile Section */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={avatarPreview || teacher.avatar} alt={teacher.name} />
                    <AvatarFallback className="text-xl font-semibold bg-primary/10">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{teacher.name}</h3>
                    <Badge 
                      variant={teacher.status === "active" ? "default" : "secondary"}
                      className="text-xs px-3 py-1"
                    >
                      {teacher.status === "active" ? "Đang làm việc" : "Nghỉ phép"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-base font-bold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              THÔNG TIN LIÊN HỆ
            </h4>
            <Card>
              <CardContent className="p-5">
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                      <p className="text-sm font-semibold truncate">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Số điện thoại</p>
                      <p className="text-sm font-semibold">{teacher.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Địa chỉ</p>
                      <p className="text-sm font-semibold">{teacher.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Professional Information */}
          <div className="space-y-4">
            <h4 className="text-base font-bold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              THÔNG TIN NGHỀ NGHIỆP
            </h4>
            <Card>
              <CardContent className="p-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-950">
                      <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Mã số giáo viên</p>
                      <p className="text-sm font-semibold">{teacher.masoGV}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-950">
                      <Users className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Giới tính</p>
                      <p className="text-sm font-semibold">{teacher.gioitinh}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-950">
                      <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Môn giảng dạy</p>
                      <p className="text-sm font-semibold">{teacher.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-950">
                      <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Lớp chủ nhiệm</p>
                      <Badge variant="outline" className="mt-1">{teacher.class}</Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-950">
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Ngày sinh</p>
                      <p className="text-sm font-semibold">{teacher.dateOfBirth ? new Date(teacher.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-950">
                      <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Ngày vào làm</p>
                      <p className="text-sm font-semibold">{teacher.joinDate ? new Date(teacher.joinDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-950">
                      <Award className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Trình độ</p>
                      <p className="text-sm font-semibold">{teacher.degree || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="p-2 rounded-full bg-cyan-100 dark:bg-cyan-950">
                      <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Kinh nghiệm</p>
                      <p className="text-sm font-semibold">{teacher.experience || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Separator className="my-6" />

          {/* Schedule */}
          <div className="space-y-4">
            <h4 className="text-base font-bold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              LỊCH LÀM VIỆC
            </h4>
            <Card>
              <CardContent className="p-5">
                <div className="space-y-2">
                  {additionalInfo.schedule.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border-2 bg-gradient-to-r from-muted/50 to-muted/30 hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="font-bold text-sm w-20 text-center px-3 py-1.5 rounded-md bg-primary/10">
                          {item.day}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {item.time}
                        </div>
                      </div>
                      <Badge variant="outline" className="font-semibold">
                        {item.class}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

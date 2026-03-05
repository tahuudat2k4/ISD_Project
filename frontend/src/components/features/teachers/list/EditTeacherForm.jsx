import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Save, X } from "lucide-react"
import dayjs from "dayjs"
import { DatePicker } from "@/components/ui/date-picker"

export function EditTeacherForm({ teacher, open, onOpenChange, onSave }) {
  const [formData, setFormData] = React.useState({
    masoGV: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    gioitinh: "",
    dateOfBirth: "",
    joinDate: "",
    degree: "",
    experience: "",
    subject: "",
    class: "",
    status: "",
  })

  React.useEffect(() => {
    if (teacher && open) {
      setFormData({
        masoGV: teacher.masoGV || "",
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
        gioitinh: teacher.gioitinh || "",
        dateOfBirth: teacher.dateOfBirth || "",
        joinDate: teacher.joinDate || "",
        degree: teacher.degree || "",
        experience: teacher.experience || "",
        subject: teacher.subject || "",
        class: teacher.class || "",
        status: teacher.status || "",
      })
    }
  }, [teacher, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...teacher,
      ...formData,
    })
    onOpenChange(false)
  }

  if (!teacher) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[650px] sm:max-w-[650px] overflow-y-auto p-6">
        <SheetHeader className="space-y-3 pb-6 px-1">
          <SheetTitle className="text-2xl font-bold">Chỉnh Sửa Thông Tin Giáo Viên</SheetTitle>
          <SheetDescription className="text-base">
            Cập nhật thông tin chi tiết của giáo viên
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pb-6 px-1">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-base font-bold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              THÔNG TIN CÁ NHÂN
            </h4>
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="masoGV" className="font-semibold">
                      Mã số giáo viên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="masoGV"
                      name="masoGV"
                      value={formData.masoGV}
                      onChange={handleChange}
                      placeholder="VD: GV001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gioitinh" className="font-semibold">
                      Giới tính <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.gioitinh} onValueChange={(value) => handleSelectChange("gioitinh", value)}>
                      <SelectTrigger id="gioitinh">
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên giáo viên"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-base font-bold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              THÔNG TIN LIÊN HỆ
            </h4>
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@school.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-semibold">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="font-semibold">
                    Địa chỉ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    required
                  />
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
              <CardContent className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-semibold">
                      Ngày sinh <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      value={formData.dateOfBirth}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dateOfBirth: date,
                        }))
                      }
                      placeholder="Chọn ngày sinh"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">
                      Ngày vào làm <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      value={formData.joinDate}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          joinDate: date,
                        }))
                      }
                      placeholder="Chọn ngày vào làm"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree" className="font-semibold">
                      Trình độ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="Cử nhân Sư phạm Mầm non"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience" className="font-semibold">
                      Kinh nghiệm <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.experience} onValueChange={(value) => handleSelectChange("experience", value)}>
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Chọn kinh nghiệm" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((year) => (
                          <SelectItem key={year} value={`${year} năm`}>
                            {year} năm
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-semibold">
                    Môn giảng dạy <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Toán - Tiếng Việt"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="class" className="font-semibold">
                      Lớp chủ nhiệm <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      placeholder="Mầm 1A"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="font-semibold">
                      Trạng thái <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Đang làm việc</SelectItem>
                        <SelectItem value="leave">Nghỉ phép</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          {/* Form Footer */}
          <SheetFooter className="flex gap-3 justify-end pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Hủy
            </Button>
            <Button type="submit" className="gap-2 bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4" />
              Lưu Thay Đổi
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

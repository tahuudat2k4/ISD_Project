import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { DatePicker } from "@/components/ui/date-picker"

const SUBJECT_OPTIONS = [
  "Toán",
  "Tiếng Việt",
  "Âm Nhạc",
  "Mỹ Thuật",
  "Thể Dục",
  "Kể Chuyện",
  "Tiếng Anh",
  "Khoa Học",
]

const CLASS_OPTIONS = [
  "Mầm 1A",
  "Mầm 1B",
  "Mầm 2A",
  "Chồi 1A",
  "Chồi 1B",
  "Chồi 2A",
  "Chồi 2B",
  "Lá 2A",
  "Lá 3A",
  "Lá 3B",
]

export function AddTeacherForm({ open = false, onOpenChange, onSave }) {
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
    status: "active",
  })

  const [errors, setErrors] = React.useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.masoGV.trim()) newErrors.masoGV = "Mã số giáo viên là bắt buộc"

    // Validate name: không cho phép nhiều space liên tiếp, không cho phép đầu/cuối có space
    const name = formData.name
    if (!name.trim()) {
      newErrors.name = "Họ và tên là bắt buộc"
    } else if (/^\s|\s$/.test(name)) {
      newErrors.name = "Tên không được có khoảng trắng ở đầu hoặc cuối"
    } else if (/\s{2,}/.test(name)) {
      newErrors.name = "Tên không được có nhiều hơn 1 khoảng trắng giữa các từ"
    }

    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ"
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc"
    } else if (!/^0[35789][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ"
    } else if (/\s/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không được chứa khoảng trắng"
    }
    const address = formData.address
    if (!address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc"
    } else if (/^\s|\s$/.test(address)) {
      newErrors.address = "Địa chỉ không được có khoảng trắng ở đầu hoặc cuối"
    } else if (/\s{2,}/.test(address)) {
      newErrors.address = "Địa chỉ không được có nhiều hơn 1 khoảng trắng liên tiếp"
    } else if (!/^[\p{L}\d\s,./\-_]{5,100}$/u.test(address)) {
      newErrors.address = "Địa chỉ chỉ cho phép chữ, số, dấu cách, dấu phẩy, chấm, gạch ngang, gạch dưới, dấu / và từ 5-100 ký tự"
    }
    if (!formData.gioitinh) newErrors.gioitinh = "Giới tính là bắt buộc"

    // Validate degree (trình độ) - không bắt buộc, chỉ kiểm tra nếu có nhập
    const degree = formData.degree
    if (degree && degree.trim()) {
      if (/^\s|\s$/.test(degree)) {
        newErrors.degree = "Trình độ không được có khoảng trắng ở đầu hoặc cuối"
      } else if (/\s{2,}/.test(degree)) {
        newErrors.degree = "Trình độ không được có nhiều hơn 1 khoảng trắng liên tiếp"
      } else if (!/^[\p{L}\d\s.,\-_]{2,50}$/u.test(degree)) {
        newErrors.degree = "Trình độ chỉ cho phép chữ, số, dấu cách, dấu chấm, phẩy, gạch ngang, gạch dưới và tối đa 50 ký tự"
      }
    }

    // Kiểm tra ngày sinh và ngày vào làm không được là ngày trong tương lai
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth)
      dob.setHours(0, 0, 0, 0)
      if (dob > today) {
        newErrors.dateOfBirth = "Ngày sinh không không hợp lệ"
      }
    }
    if (formData.joinDate) {
      const join = new Date(formData.joinDate)
      join.setHours(0, 0, 0, 0)
      if (join > today) {
        newErrors.joinDate = "Ngày vào làm không hợp lệ"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
      resetForm()
      onOpenChange(false)
    }
  }

  const resetForm = () => {
    setFormData({
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
      status: "active",
    })
    setErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm Giáo Viên Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Personal Information */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              THÔNG TIN CÁ NHÂN
            </h4>
            <Card>
              <CardContent className="p-3 space-y-2 pt-0 pb-0">
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="masoGV" className="text-xs font-semibold">
                      Mã số <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="masoGV"
                      name="masoGV"
                      value={formData.masoGV}
                      onChange={handleChange}
                      placeholder="GV001"
                      className={`h-8 text-xs ${errors.masoGV ? "border-red-500" : ""}`}
                    />
                    {errors.masoGV && (
                      <p className="text-xs text-red-500">{errors.masoGV}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-xs font-semibold">
                      Họ tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tên giáo viên"
                      className={`h-8 text-xs ${errors.name ? "border-red-500" : ""}`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="gioitinh" className="text-xs font-semibold">
                      Giới tính <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gioitinh}
                      onValueChange={(value) => handleSelectChange("gioitinh", value)}
                    >
                      <SelectTrigger id="gioitinh" className={`h-8 text-xs ${errors.gioitinh ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Chọn" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gioitinh && (
                      <p className="text-xs text-red-500">{errors.gioitinh}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="dateOfBirth" className="text-xs font-semibold">
                      Ngày sinh
                    </Label>
                    <DatePicker
                      value={formData.dateOfBirth}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          dateOfBirth: date,
                        }))
                      }
                      placeholder="DD/MM/YYYY"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              THÔNG TIN LIÊN HỆ
            </h4>
            <Card>
              <CardContent className="p-3 space-y-2 pt-0 pb-0">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="email" className="text-xs font-semibold">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@school.com"
                      className={`h-8 text-xs ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-xs font-semibold">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                      className={`h-8 text-xs ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs font-semibold">
                    Địa chỉ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ"
                    className={`h-8 text-xs ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500">{errors.address}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Information */}
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              THÔNG TIN NGHỀ NGHIỆP
            </h4>
            <Card>
              <CardContent className="p-3 space-y-2">
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Ngày vào làm</Label>
                    <DatePicker
                      value={formData.joinDate}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          joinDate: date,
                        }))
                      }
                      placeholder="DD/MM/YYYY"
                    />
                    {errors.joinDate && (
                      <p className="text-xs text-red-500">{errors.joinDate}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="degree" className="text-xs font-semibold">
                      Trình độ
                    </Label>
                    <Input
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="Cử nhân..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="experience" className="text-xs font-semibold">
                      Kinh nghiệm
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      min={0}
                      step={1}
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Số năm"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="subject" className="text-xs font-semibold">
                      Môn giảng dạy
                    </Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => handleSelectChange("subject", value)}
                    >
                      <SelectTrigger id="subject" className="h-8 text-xs">
                        <SelectValue placeholder="Chọn môn" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECT_OPTIONS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="class" className="text-xs font-semibold">
                      Lớp chủ nhiệm
                    </Label>
                    <Select
                      value={formData.class}
                      onValueChange={(value) => handleSelectChange("class", value)}
                    >
                      <SelectTrigger id="class" className="h-8 text-xs">
                        <SelectValue placeholder="Chọn lớp" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASS_OPTIONS.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="status" className="text-xs font-semibold">
                      Trạng thái
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status" className="h-8 text-xs">
                        <SelectValue placeholder="Chọn" />
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

          <DialogFooter className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              className="h-8 text-xs gap-2"
            >
              <X className="h-3 w-3" />
              Hủy
            </Button>
            <Button type="submit" className="h-8 text-xs gap-2 bg-primary hover:bg-primary/90">
              <Save className="h-3 w-3" />
              Thêm Giáo Viên
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

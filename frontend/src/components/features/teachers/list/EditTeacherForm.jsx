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
  const [phoneError, setPhoneError] = React.useState("")
  const [nameError, setNameError] = React.useState("")
  const [addressError, setAddressError] = React.useState("")
  const [dobError, setDobError] = React.useState("")
  const [joinDateError, setJoinDateError] = React.useState("")

  React.useEffect(() => {
    if (teacher && open) {
      // Normalize status to one of: 'active', 'leave', 'inactive'
      let status = teacher.status || ""
      if (status === "Đang làm việc") status = "active"
      else if (status === "Nghỉ phép") status = "leave"
      else if (status === "Không hoạt động") status = "inactive"

      // Normalize experience to format 'X năm' (if it's a number)
      let experience = teacher.kinhnghiem || teacher.experience || ""
      if (experience && typeof experience === "string") {
        const match = experience.match(/(\d+)/)
        if (match) experience = `${match[1]} năm`
      }

      setFormData({
        masoGV: teacher.masoGV || "",
        name: teacher.hotenGV || teacher.name || "",
        email: teacher.email || "",
        phone: teacher.sdt || teacher.phone || "",
        address: teacher.diachi || teacher.address || "",
        gioitinh: teacher.gioitinh || "",
        dateOfBirth: teacher.ngaysinh || teacher.dateOfBirth || "",
        joinDate: teacher.ngayvaolam || teacher.joinDate || "",
        degree: teacher.trinhdohocvan || teacher.degree || "",
        experience: experience,
        subject: teacher.subject || "",
        class: teacher.class || "",
        status: status,
      })
    }
  }, [teacher, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "phone") {
      // Chỉ cho phép số và kiểm tra độ dài
      const onlyNums = value.replace(/\D/g, "")
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNums,
      }))
      if (onlyNums.length !== 10) {
        setPhoneError("Số điện thoại phải đủ 10 số")
      } else {
        setPhoneError("")
      }
    } else if (name === "name") {
      // Chỉ cho phép chữ và khoảng trắng, không để trống
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
      if (!value.trim()) {
        setNameError("Họ và tên không được để trống")
      } else if (!/^([\p{L}\s]+)$/u.test(value)) {
        setNameError("Họ và tên chỉ được chứa chữ cái và khoảng trắng")
      } else {
        setNameError("")
      }
    } else if (name === "address") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
      if (!value.trim()) {
        setAddressError("Địa chỉ không được để trống")
      } else if (value.length < 5) {
        setAddressError("Địa chỉ phải có ít nhất 5 ký tự")
      } else if (/[<>\{\};]/.test(value)) {
        setAddressError("Địa chỉ không được chứa ký tự đặc biệt: <, >, {, }, ;")
      } else {
        setAddressError("")
      }
    } else if (name === "dateOfBirth") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
      if (!value) {
        setDobError("Ngày sinh không được để trống")
      } else if (dayjs(value).isAfter(dayjs(), 'day')) {
        setDobError("Ngày sinh phải nhỏ hơn ngày hiện tại")
      } else {
        setDobError("")
      }
    } else if (name === "joinDate") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
      if (!value) {
        setJoinDateError("Ngày vào làm không được để trống")
      } else if (formData.dateOfBirth && dayjs(value).isBefore(dayjs(formData.dateOfBirth), 'day')) {
        setJoinDateError("Ngày vào làm phải sau ngày sinh")
      } else if (dayjs(value).isAfter(dayjs(), 'day')) {
        setJoinDateError("Ngày vào làm không được lớn hơn ngày hiện tại")
      } else {
        setJoinDateError("")
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Kiểm tra số điện thoại
    let valid = true
    if (formData.phone.length !== 10) {
      setPhoneError("Số điện thoại phải đủ 10 số")
      valid = false
    } else {
      setPhoneError("")
    }
    // Kiểm tra họ và tên
    if (!formData.name.trim()) {
      setNameError("Họ và tên không được để trống")
      valid = false
    } else if (!/^([\p{L}\s]+)$/u.test(formData.name)) {
      setNameError("Họ và tên chỉ được chứa chữ cái và khoảng trắng")
      valid = false
    } else {
      setNameError("")
    }
    // Kiểm tra địa chỉ
    if (!formData.address.trim()) {
      setAddressError("Địa chỉ không được để trống")
      valid = false
    } else if (formData.address.length < 5) {
      setAddressError("Địa chỉ phải có ít nhất 5 ký tự")
      valid = false
    } else if (/[<>\{\};]/.test(formData.address)) {
      setAddressError("Địa chỉ không được chứa ký tự đặc biệt: <, >, {, }, ;")
      valid = false
    } else {
      setAddressError("")
    }
    // Kiểm tra ngày sinh
    if (!formData.dateOfBirth) {
      setDobError("Ngày sinh không được để trống")
      valid = false
    } else if (dayjs(formData.dateOfBirth).isAfter(dayjs(), 'day')) {
      setDobError("Ngày sinh phải nhỏ hơn ngày hiện tại")
      valid = false
    } else {
      setDobError("")
    }
    // Kiểm tra ngày vào làm
    if (!formData.joinDate) {
      setJoinDateError("Ngày vào làm không được để trống")
      valid = false
    } else if (formData.dateOfBirth && dayjs(formData.joinDate).isBefore(dayjs(formData.dateOfBirth), 'day')) {
      setJoinDateError("Ngày vào làm phải sau ngày sinh")
      valid = false
    } else if (dayjs(formData.joinDate).isAfter(dayjs(), 'day')) {
      setJoinDateError("Ngày vào làm không được lớn hơn ngày hiện tại")
      valid = false
    } else {
      setJoinDateError("")
    }
    if (!valid) return
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
                  {nameError && (
                    <div className="text-red-500 text-sm mt-1">{nameError}</div>
                  )}
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
                    maxLength={10}
                  />
                  {phoneError && (
                    <div className="text-red-500 text-sm mt-1">{phoneError}</div>
                  )}
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
                  {addressError && (
                    <div className="text-red-500 text-sm mt-1">{addressError}</div>
                  )}
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
                      onChange={(date) => handleChange({ target: { name: "dateOfBirth", value: date } })}
                      placeholder="Chọn ngày sinh"
                    />
                    {dobError && (
                      <div className="text-red-500 text-sm mt-1">{dobError}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">
                      Ngày vào làm <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      value={formData.joinDate}
                      onChange={(date) => handleChange({ target: { name: "joinDate", value: date } })}
                      placeholder="Chọn ngày vào làm"
                    />
                    {joinDateError && (
                      <div className="text-red-500 text-sm mt-1">{joinDateError}</div>
                    )}
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

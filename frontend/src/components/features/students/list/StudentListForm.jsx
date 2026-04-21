import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const STUDENT_STATUSES = ["Đang học", "Nghỉ học", "Nghỉ phép"]
const STUDENT_CODE_REGEX = /^[A-Za-z0-9_-]{2,20}$/
const PHONE_REGEX = /^0[0-9]{9}$/
const DISPLAY_DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/

const formatDateForDisplay = (value) => {
  if (!value) {
    return ""
  }

  const normalizedValue = String(value).trim()
  const displayMatch = normalizedValue.match(DISPLAY_DATE_REGEX)

  if (displayMatch) {
    return normalizedValue
  }

  const isoMatch = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})/)

  if (isoMatch) {
    const [, year, month, day] = isoMatch
    return `${day}/${month}/${year}`
  }

  const date = new Date(normalizedValue)

  if (Number.isNaN(date.getTime())) {
    return normalizedValue
  }

  return date.toLocaleDateString("vi-VN")
}

const normalizeDisplayDateInput = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 8)

  if (digits.length <= 2) {
    return digits
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

const parseDisplayDate = (value) => {
  if (!value) {
    return null
  }

  const match = String(value).trim().match(DISPLAY_DATE_REGEX)

  if (!match) {
    return null
  }

  const [, dayString, monthString, yearString] = match
  const day = Number(dayString)
  const month = Number(monthString)
  const year = Number(yearString)
  const date = new Date(year, month - 1, day)

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}

const toApiDateValue = (value) => {
  const parsedDate = parseDisplayDate(value)

  if (!parsedDate) {
    return ""
  }

  return new Date(Date.UTC(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate()
  )).toISOString()
}

const getInitialFormData = () => ({
  code: "",
  name: "",
  status: "Đang học",
  gender: "",
  dob: "",
  address: "",
  phone: "",
  className: "",
  classId: "",
  health: "",
  notes: "",
  enrollmentDate: "",
})

const normalizeStudentForForm = (student) => ({
  ...getInitialFormData(),
  ...student,
  status: student?.status || "Đang học",
  dob: formatDateForDisplay(student?.dobValue || student?.dob || ""),
  classId: student?.classId || student?.raw?.lopId?._id || "",
  className: student?.className || student?.raw?.lopId?.tenlop || "",
  enrollmentDate: student?.enrollmentDateValue || student?.enrollmentDate || "",
})

const normalizeCode = (value) => String(value || "").trim().toLowerCase()

const normalizeClassOptions = (classOptions = []) => classOptions.map((classItem) => ({
  id: classItem?.id || classItem?._id || "",
  name: classItem?.name || classItem?.tenlop || "",
}))

const hasLeadingOrTrailingSpaces = (value) => /^\s|\s$/.test(value)

const hasMultipleSpaces = (value) => /\s{2,}/.test(value)

const isFutureDate = (value) => {
  if (!value) {
    return false
  }

  const date = parseDisplayDate(value)

  if (!date) {
    return true
  }

  date.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return date > today
}

const validateStudentForm = ({ formData, classes, existingStudents, currentStudentId }) => {
  const errors = {}

  if (!formData.code.trim()) {
    errors.code = "Mã số học sinh là bắt buộc"
  } else if (hasLeadingOrTrailingSpaces(formData.code)) {
    errors.code = "Mã số học sinh không được có khoảng trắng ở đầu hoặc cuối"
  } else if (/\s/.test(formData.code)) {
    errors.code = "Mã số học sinh không được chứa khoảng trắng"
  } else if (!STUDENT_CODE_REGEX.test(formData.code)) {
    errors.code = "Mã số học sinh chỉ gồm chữ, số, dấu gạch ngang hoặc gạch dưới và dài 2-20 ký tự"
  } else {
    const duplicatedStudent = existingStudents.find(
      (item) => normalizeCode(item.code) === normalizeCode(formData.code) && item.id !== currentStudentId
    )

    if (duplicatedStudent) {
      errors.code = "Mã số học sinh đã tồn tại"
    }
  }

  if (!formData.name.trim()) {
    errors.name = "Họ tên học sinh là bắt buộc"
  } else if (hasLeadingOrTrailingSpaces(formData.name)) {
    errors.name = "Họ tên không được có khoảng trắng ở đầu hoặc cuối"
  } else if (hasMultipleSpaces(formData.name)) {
    errors.name = "Họ tên không được có nhiều hơn 1 khoảng trắng giữa các từ"
  } else if (!/^[\p{L}]+(?: [\p{L}]+)*$/u.test(formData.name)) {
    errors.name = "Họ tên chỉ được chứa chữ cái và khoảng trắng"
  } else if (!formData.name.includes(" ")) {
    errors.name = "Họ tên phải có ít nhất một khoảng trắng ngăn cách giữa các từ"
  } else {
    // Kiểm tra từng từ phải đúng chuẩn: chỉ chữ cái, chỉ 1 ký tự in hoa đầu, còn lại thường
    const words = formData.name.split(" ")
    for (const word of words) {
      if (!/^\p{Lu}[\p{Ll}]+$/u.test(word)) {
        errors.name = "Mỗi từ trong họ tên phải bắt đầu bằng chữ in hoa, các ký tự còn lại là thường"
        break
      }
    }
  }

  if (!formData.classId) {
    errors.classId = "Lớp học là bắt buộc"
  } else if (!classes.some((item) => item.id === formData.classId)) {
    errors.classId = "Lớp học đã chọn không hợp lệ"
  }

  if (!formData.dob.trim()) {
    errors.dob = "Ngày sinh là bắt buộc"
  } else if (isFutureDate(formData.dob)) {
    errors.dob = "Ngày sinh phải đúng định dạng dd/mm/yyyy và không được lớn hơn ngày hiện tại"
  }

  if (!formData.gender) {
    errors.gender = "Giới tính là bắt buộc"
  }

  if (formData.phone.trim()) {
    if (hasLeadingOrTrailingSpaces(formData.phone)) {
      errors.phone = "Số điện thoại không được có khoảng trắng ở đầu hoặc cuối"
    } else if (/\s/.test(formData.phone)) {
      errors.phone = "Số điện thoại không được chứa khoảng trắng"
    } else if (!PHONE_REGEX.test(formData.phone)) {
      errors.phone = "Số điện thoại không hợp lệ"
    }
  }

  if (formData.address.trim()) {
    if (hasLeadingOrTrailingSpaces(formData.address)) {
      errors.address = "Địa chỉ không được có khoảng trắng ở đầu hoặc cuối"
    } else if (hasMultipleSpaces(formData.address)) {
      errors.address = "Địa chỉ không được có nhiều hơn 1 khoảng trắng liên tiếp"
    } else if (!/^[\p{L}\d\s,./\-_]{5,100}$/u.test(formData.address)) {
      errors.address = "Địa chỉ chỉ cho phép chữ, số, dấu cách, dấu phẩy, dấu chấm, dấu gạch ngang, dấu gạch dưới, dấu / và dài 5-100 ký tự"
    }
  }

  if (formData.notes.trim().length > 255) {
    errors.notes = "Ghi chú không được vượt quá 255 ký tự"
  }

  return errors
}

const normalizePayload = (formData) => ({
  ...formData,
  code: formData.code.trim(),
  name: formData.name.trim(),
  dob: toApiDateValue(formData.dob),
  address: formData.address.trim(),
  phone: formData.phone.trim(),
  notes: formData.notes.trim(),
})

const getFieldErrorProps = (error) => ({
  "aria-invalid": Boolean(error),
  className: cn(error && "border-destructive"),
})

export function StudentListForm({
  open,
  onOpenChange,
  student,
  onSubmit,
  existingStudents = [],
  classOptions = [],
  disableClassSelection = false,
  allowCreateStudent = true,
}) {
  const classes = normalizeClassOptions(classOptions)
  const [formData, setFormData] = useState(getInitialFormData())
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) {
      return
    }

    if (student) {
      setFormData(normalizeStudentForForm(student))
    } else {
      setFormData(getInitialFormData())
    }

    setErrors({})
  }, [open, student])

  const handleChange = (field, value) => {
    const nextValue = field === "dob" ? normalizeDisplayDateInput(value) : value

    setFormData((prev) => ({ ...prev, [field]: nextValue }))

    setErrors((prev) => {
      if (!prev[field]) {
        return prev
      }

      const nextErrors = { ...prev }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const handleSubmit = async () => {
    if (!student && !allowCreateStudent) {
      return
    }

    const validationErrors = validateStudentForm({
      formData,
      classes,
      existingStudents,
      currentStudentId: student?.id,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const isSuccess = await onSubmit(normalizePayload(formData))

    if (isSuccess !== false) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{student ? "Cập nhật học sinh" : "Thêm học sinh mới"}</DialogTitle>
          <DialogDescription>
            Điền thông tin học sinh vào form dưới đây
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="code">Mã số *</Label>
              <Input
                id="code"
                placeholder="HS001"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                {...getFieldErrorProps(errors.code)}
              />
              {errors.code ? <p className="text-sm text-destructive">{errors.code}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Ngày sinh *</Label>
              <Input
                id="dob"
                type="text"
                inputMode="numeric"
                placeholder="dd/mm/yyyy"
                maxLength={10}
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                {...getFieldErrorProps(errors.dob)}
              />
              {errors.dob ? <p className="text-sm text-destructive">{errors.dob}</p> : null}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Họ tên *</Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              {...getFieldErrorProps(errors.name)}
            />
            {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                <SelectTrigger id="gender" className={cn("w-full", errors.gender && "border-destructive")} aria-invalid={Boolean(errors.gender)}>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender ? <p className="text-sm text-destructive">{errors.gender}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {STUDENT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="className">Lớp *</Label>
            <Select 
              value={formData.classId} 
              disabled={disableClassSelection}
              onValueChange={(value) => {
                const selectedClass = classes.find((classItem) => classItem.id === value)
                handleChange("classId", value)
                handleChange("className", selectedClass?.name || "")
              }}
            >
              <SelectTrigger id="className" className={cn("w-full", errors.classId && "border-destructive")} aria-invalid={Boolean(errors.classId)}>
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.classId ? <p className="text-sm text-destructive">{errors.classId}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="health">Sức khỏe</Label>
            <Select value={formData.health} onValueChange={(value) => handleChange("health", value)}>
              <SelectTrigger id="health" className="w-full">
                <SelectValue placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tốt">Tốt</SelectItem>
                <SelectItem value="Khá">Khá</SelectItem>
                <SelectItem value="Trung bình">Trung bình</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              {...getFieldErrorProps(errors.address)}
            />
            {errors.address ? <p className="text-sm text-destructive">{errors.address}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              placeholder="0123456789"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              {...getFieldErrorProps(errors.phone)}
            />
            {errors.phone ? <p className="text-sm text-destructive">{errors.phone}</p> : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú về học sinh (nếu có)..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              className={cn("resize-none", errors.notes && "border-destructive")}
              aria-invalid={Boolean(errors.notes)}
            />
            {errors.notes ? <p className="text-sm text-destructive">{errors.notes}</p> : null}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!student && !allowCreateStudent}>
            {student ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import * as React from "react"
import { LoaderCircle, Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { CLASS_STATUSES } from "./classViewModel"

const normalizeClassName = (value) => String(value || "").trim().toLocaleLowerCase()
const ASSISTANT_TEACHER_REGEX = /^[\p{L}]+(?: [\p{L}]+)*$/u
const normalizeText = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase()
  .trim()

const validateAssistantTeacher = (value) => {
  if (!value) {
    return ""
  }

  if (/^\s|\s$/.test(value)) {
    return "Giáo viên phụ trợ không được có khoảng trắng ở đầu hoặc cuối"
  }

  if (/\s{2,}/.test(value)) {
    return "Giáo viên phụ trợ không được có nhiều hơn 1 khoảng trắng giữa các từ"
  }

  if (!value.includes(" ")) {
    return "Giáo viên phụ trợ phải có khoảng trắng ngăn cách giữa các từ"
  }

  if (!ASSISTANT_TEACHER_REGEX.test(value)) {
    return "Giáo viên phụ trợ chỉ được chứa chữ cái và khoảng trắng"
  }

  return ""
}

const isValidClassNameForGrade = (value, gradeLabel) => {
  if (!gradeLabel) {
    return true
  }

  return normalizeText(value).startsWith(normalizeText(gradeLabel))
}

const isValidClassCode = (value, gradeCode) => {
  if (!gradeCode) {
    return true
  }

  return new RegExp(`^${gradeCode}\\d+$`, "i").test(String(value || "").trim())
}

const initialFormState = {
  malop: "",
  tenlop: "",
  giaoVienId: "",
  status: "Hoạt động",
  capacity: 30,
  assistantTeacher: "",
  facilities: "",
  notes: "",
}

export function ClassCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  gradeLabel,
  gradeCode = "",
  teachers = [],
  existingClasses = [],
  submitting = false,
}) {
  const [form, setForm] = React.useState(initialFormState)
  const [errors, setErrors] = React.useState({})

  React.useEffect(() => {
    if (!open) {
      setForm(initialFormState)
      setErrors({})
    }
  }, [open])

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))

    setErrors((prev) => {
      if (!prev[field]) {
        return prev
      }

      const nextErrors = { ...prev }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {}
    const normalizedClassCode = form.malop.trim().toUpperCase()
    const normalizedClassName = normalizeClassName(form.tenlop)

    if (!normalizedClassCode) {
      nextErrors.malop = "Mã lớp là bắt buộc"
    } else if (!isValidClassCode(normalizedClassCode, gradeCode)) {
      nextErrors.malop = `Mã lớp khối ${gradeLabel || "này"} phải bắt đầu bằng ${gradeCode} và theo sau là số`
    }

    if (!normalizedClassName) {
      nextErrors.tenlop = "Tên lớp là bắt buộc"
    } else if (!isValidClassNameForGrade(form.tenlop, gradeLabel)) {
      nextErrors.tenlop = `Tên lớp khối ${gradeLabel || "này"} phải bắt đầu bằng ${gradeLabel}`
    } else if (existingClasses.some((classItem) => normalizeClassName(classItem.name) === normalizedClassName)) {
      nextErrors.tenlop = "Tên lớp đã tồn tại"
    }

    const assistantTeacherError = validateAssistantTeacher(form.assistantTeacher)
    if (assistantTeacherError) {
      nextErrors.assistantTeacher = assistantTeacherError
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    await onSubmit({
      malop: form.malop.trim(),
      tenlop: form.tenlop.trim(),
      giaoVienId: form.giaoVienId,
      status: form.status,
      succhua: Number(form.capacity) || 30,
      giaovienphutro: form.assistantTeacher.trim(),
      cosovatchat: form.facilities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      ghichu: form.notes.trim(),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="size-5 text-emerald-600" />
            Thêm lớp mới
          </DialogTitle>
          <DialogDescription>
            Tạo lớp thật trong hệ thống cho khối {gradeLabel || "đã chọn"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="gradeName">Khối lớp</Label>
            <Input id="gradeName" value={gradeLabel || "Chưa xác định"} disabled />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="malop">
                Mã lớp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="malop"
                value={form.malop}
                onChange={(event) => handleFieldChange("malop", event.target.value)}
                placeholder={gradeCode ? `Ví dụ: ${gradeCode}01` : "Ví dụ: MAM01"}
                aria-invalid={Boolean(errors.malop)}
                className={errors.malop ? "border-destructive" : undefined}
                disabled={submitting}
              />
              {errors.malop ? <p className="text-sm text-destructive">{errors.malop}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tenlop">
                Tên lớp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tenlop"
                value={form.tenlop}
                onChange={(event) => handleFieldChange("tenlop", event.target.value)}
                placeholder="Ví dụ: Mầm 1A"
                aria-invalid={Boolean(errors.tenlop)}
                className={errors.tenlop ? "border-destructive" : undefined}
                disabled={submitting}
              />
              {errors.tenlop ? <p className="text-sm text-destructive">{errors.tenlop}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="giaoVienId">
                Giáo viên chủ nhiệm <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.giaoVienId}
                onValueChange={(value) => handleFieldChange("giaoVienId", value)}
                disabled={submitting}
              >
                <SelectTrigger id="giaoVienId">
                  <SelectValue placeholder="Chọn giáo viên" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.hotenGV} ({teacher.masoGV})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(value) => handleFieldChange("status", value)}
                disabled={submitting}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="capacity">Sức chứa</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(event) => handleFieldChange("capacity", event.target.value)}
                placeholder="30"
                disabled={submitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assistantTeacher">Giáo viên phụ trợ</Label>
              <Input
                id="assistantTeacher"
                value={form.assistantTeacher}
                onChange={(event) => handleFieldChange("assistantTeacher", event.target.value)}
                placeholder="Nhập tên giáo viên phụ trợ"
                aria-invalid={Boolean(errors.assistantTeacher)}
                className={errors.assistantTeacher ? "border-destructive" : undefined}
                disabled={submitting}
              />
              {errors.assistantTeacher ? <p className="text-sm text-destructive">{errors.assistantTeacher}</p> : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="facilities">Cơ sở vật chất</Label>
            <Textarea
              id="facilities"
              value={form.facilities}
              onChange={(event) => handleFieldChange("facilities", event.target.value)}
              placeholder="Nhập các mục, cách nhau bằng dấu phẩy"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(event) => handleFieldChange("notes", event.target.value)}
              placeholder="Nhập ghi chú lớp học"
              disabled={submitting}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={submitting || teachers.length === 0}>
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo lớp"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
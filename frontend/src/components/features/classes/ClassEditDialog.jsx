import * as React from "react"
import { LoaderCircle, Pencil } from "lucide-react"

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

const normalizeText = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase()
  .trim()
const ASSISTANT_TEACHER_REGEX = /^[\p{L}]+(?: [\p{L}]+)*$/u

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
    return "Phải có khoảng trắng ngăn cách giữa các từ"
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

export function ClassEditDialog({
  open,
  onOpenChange,
  onSubmit,
  gradeLabel,
  gradeCode = "",
  teachers = [],
  classItem,
  submitting = false,
}) {
  const [form, setForm] = React.useState(initialFormState)
  const [errors, setErrors] = React.useState({})

  React.useEffect(() => {
    if (!open || !classItem) {
      setForm(initialFormState)
      setErrors({})
      return
    }

    setForm({
      malop: classItem.code || "",
      tenlop: classItem.name || "",
      giaoVienId: classItem.mainTeacherId || "",
      status: classItem.status || "Hoạt động",
      capacity: classItem.capacity || 30,
      assistantTeacher: classItem.assistantTeacher === "Chưa cập nhật" ? "" : classItem.assistantTeacher || "",
      facilities: Array.isArray(classItem.facilities) ? classItem.facilities.join(", ") : "",
      notes: classItem.notes === "Chưa có ghi chú" ? "" : classItem.notes || "",
    })
    setErrors({})
  }, [classItem, open])

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

    if (!normalizedClassCode) {
      nextErrors.malop = "Mã lớp là bắt buộc"
    } else if (!isValidClassCode(normalizedClassCode, gradeCode)) {
      nextErrors.malop = `Mã lớp khối ${gradeLabel || "này"} phải bắt đầu bằng ${gradeCode} và theo sau là số`
    }

    if (!form.tenlop.trim()) {
      nextErrors.tenlop = "Tên lớp là bắt buộc"
    } else if (!isValidClassNameForGrade(form.tenlop, gradeLabel)) {
      nextErrors.tenlop = `Tên lớp khối ${gradeLabel || "này"} phải bắt đầu bằng ${gradeLabel}`
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
            <Pencil className="size-5 text-amber-600" />
            Cập nhật lớp học
          </DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin lớp {classItem?.name || "đã chọn"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="editGradeName">Khối lớp</Label>
            <Input id="editGradeName" value={gradeLabel || classItem?.gradeName || "Chưa xác định"} disabled />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="editMalop">Mã lớp</Label>
              <Input
                id="editMalop"
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
              <Label htmlFor="editTenlop">Tên lớp</Label>
              <Input
                id="editTenlop"
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
              <Label htmlFor="editGiaoVienId">Giáo viên chủ nhiệm</Label>
              <Select
                value={form.giaoVienId}
                onValueChange={(value) => handleFieldChange("giaoVienId", value)}
                disabled={submitting}
              >
                <SelectTrigger id="editGiaoVienId">
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
              <Label htmlFor="editAssistantTeacher">Giáo viên phụ trợ</Label>
              <Input
                id="editAssistantTeacher"
                value={form.assistantTeacher}
                onChange={(event) => handleFieldChange("assistantTeacher", event.target.value)}
                placeholder="Nhập tên giáo viên phụ trợ"
                aria-invalid={Boolean(errors.assistantTeacher)}
                className={errors.assistantTeacher ? "border-destructive" : undefined}
                disabled={submitting}
              />
              {errors.assistantTeacher ? <p className="text-sm text-destructive">{errors.assistantTeacher}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editCapacity">Sức chứa</Label>
              <Input
                id="editCapacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(event) => handleFieldChange("capacity", event.target.value)}
                placeholder="30"
                disabled={submitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editStatus">Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(value) => handleFieldChange("status", value)}
                disabled={submitting}
              >
                <SelectTrigger id="editStatus">
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="editFacilities">Cơ sở vật chất</Label>
            <Textarea
              id="editFacilities"
              value={form.facilities}
              onChange={(event) => handleFieldChange("facilities", event.target.value)}
              placeholder="Nhập các mục, cách nhau bằng dấu phẩy"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="editNotes">Ghi chú</Label>
            <Textarea
              id="editNotes"
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
                  Đang cập nhật...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
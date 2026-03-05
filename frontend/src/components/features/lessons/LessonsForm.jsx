import { useEffect, useMemo, useState } from "react"
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
import { allClasses, classByGrade, gradeOptions, statusOptions, topics } from "./lessonsData"

const emptyForm = {
  code: "",
  title: "",
  grade: "mam",
  className: "",
  topic: "",
  teacher: "",
  date: "",
  duration: "",
  status: "Sắp tới",
  room: "",
  objectivesText: "",
  materialsText: "",
  notes: "",
}

export function LessonsForm({ open, onOpenChange, lesson, onSubmit }) {
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    if (lesson) {
      setFormData({
        code: lesson.code || "",
        title: lesson.title || "",
        grade: lesson.grade || "mam",
        className: lesson.className || "",
        topic: lesson.topic || "",
        teacher: lesson.teacher || "",
        date: lesson.date || "",
        duration: lesson.duration || "",
        status: lesson.status || "Sắp tới",
        room: lesson.room || "",
        objectivesText: (lesson.objectives || []).join(", "),
        materialsText: (lesson.materials || []).join(", "),
        notes: lesson.notes || "",
      })
    } else {
      setFormData(emptyForm)
    }
  }, [lesson])

  const classOptions = useMemo(() => {
    return formData.grade === "all"
      ? allClasses
      : classByGrade[formData.grade] || []
  }, [formData.grade])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const objectives = formData.objectivesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    const materials = formData.materialsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)

    onSubmit({
      ...lesson,
      code: formData.code.trim(),
      title: formData.title.trim(),
      grade: formData.grade,
      className: formData.className,
      topic: formData.topic,
      teacher: formData.teacher.trim(),
      date: formData.date,
      duration: formData.duration.trim(),
      status: formData.status,
      room: formData.room.trim(),
      objectives,
      materials,
      notes: formData.notes.trim(),
    })

    onOpenChange(false)
  }

  const isValid = formData.code && formData.title && formData.className && formData.date

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? "Cập nhật bài giảng" : "Tạo bài giảng mới"}</DialogTitle>
          <DialogDescription>
            Điền thông tin bài giảng cho từng lớp và từng khối.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="code">Mã bài giảng *</Label>
              <Input
                id="code"
                placeholder="BG001"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Ngày *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Tên bài giảng *</Label>
            <Input
              id="title"
              placeholder="Nhập tên bài giảng"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Khối *</Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => {
                  handleChange("grade", value)
                  handleChange("className", "")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khối" />
                </SelectTrigger>
                <SelectContent>
                  {gradeOptions.map((grade) => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lớp *</Label>
              <Select
                value={formData.className}
                onValueChange={(value) => handleChange("className", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Chủ đề</Label>
              <Select value={formData.topic} onValueChange={(value) => handleChange("topic", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.filter((s) => s.value !== "all").map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Giáo viên</Label>
              <Input
                placeholder="Nhập tên giáo viên"
                value={formData.teacher}
                onChange={(e) => handleChange("teacher", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Phòng học</Label>
              <Input
                placeholder="Phòng 101"
                value={formData.room}
                onChange={(e) => handleChange("room", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Thời lượng</Label>
              <Input
                placeholder="45 phút"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mục tiêu (phân tách bằng dấu phẩy)</Label>
            <Textarea
              rows={2}
              placeholder="Nhận biết chữ A, Phát âm chuẩn, Tô chữ A"
              value={formData.objectivesText}
              onChange={(e) => handleChange("objectivesText", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Dụng cụ (phân tách bằng dấu phẩy)</Label>
            <Textarea
              rows={2}
              placeholder="Thẻ chữ, Bảng, Bút màu"
              value={formData.materialsText}
              onChange={(e) => handleChange("materialsText", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              rows={2}
              placeholder="Ghi chú cho bài giảng"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {lesson ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

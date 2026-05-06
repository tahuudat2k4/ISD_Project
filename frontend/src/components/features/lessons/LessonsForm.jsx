import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
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
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FileImage, FileText, Paperclip } from "lucide-react"
import { topics } from "./lessonsData"

const ACCEPTED_ATTACHMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

const LESSON_TITLE_PATTERN = /^[\p{L}0-9\s]+$/u
const DURATION_PATTERN = /^[\p{L}0-9\s]+$/u
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 255
const MAX_DURATION_LENGTH = 50
const MAX_ATTACHMENT_SIZE = 8 * 1024 * 1024

const ATTACHMENT_TYPE_BY_EXTENSION = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

const getFileExtension = (fileName = "") => {
  const normalizedName = String(fileName).trim().toLowerCase()
  const lastDotIndex = normalizedName.lastIndexOf(".")

  return lastDotIndex >= 0 ? normalizedName.slice(lastDotIndex) : ""
}

const resolveAttachmentMimeType = (file) => {
  const detectedType = String(file?.type || "").trim().toLowerCase()
  if (ACCEPTED_ATTACHMENT_TYPES.includes(detectedType)) {
    return detectedType
  }

  return ATTACHMENT_TYPE_BY_EXTENSION[getFileExtension(file?.name)] || ""
}

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result || ""))
  reader.onerror = () => reject(new Error("Không thể đọc tệp đính kèm"))
  reader.readAsDataURL(file)
})

const emptyForm = {
  code: "",
  title: "",
  classId: "",
  topic: "",
  date: "",
  duration: "",
}

export function LessonsForm({
  open,
  onOpenChange,
  lesson,
  onSubmit,
  classOptions = [],
  selectedClassId = "",
  submitting = false,
}) {
  const [formData, setFormData] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [attachmentError, setAttachmentError] = useState("")
  const [removeAttachment, setRemoveAttachment] = useState(false)

  const normalizedClassOptions = useMemo(() => {
    return classOptions.map((classItem) => ({ ...classItem }))
  }, [classOptions])

  useEffect(() => {
    const defaultClass = normalizedClassOptions.find((classItem) => classItem.id === selectedClassId)
      || normalizedClassOptions[0]
      || null

    if (lesson) {
      setFormData({
        code: lesson.code || "",
        title: lesson.title || "",
        classId: lesson.classId || defaultClass?.id || "",
        topic: lesson.topic || "",
        date: lesson.date || "",
        duration: lesson.duration || "",
      })
      setAttachmentFile(null)
      setAttachmentError("")
      setRemoveAttachment(false)
      setErrors({})
    } else {
      setFormData({
        ...emptyForm,
        classId: defaultClass?.id || "",
      })
      setAttachmentFile(null)
      setAttachmentError("")
      setRemoveAttachment(false)
      setErrors({})
    }
  }, [lesson, normalizedClassOptions, selectedClassId])

  const attachmentLabel = attachmentFile
    ? attachmentFile.file.name
    : removeAttachment
      ? "Tài liệu sẽ được gỡ khỏi bài giảng"
    : lesson?.attachment?.fileName || "Chọn ảnh hoặc tài liệu Word"

  const AttachmentIcon = attachmentFile?.mimeType?.startsWith("image/") || (!removeAttachment && lesson?.attachment?.mimeType?.startsWith("image/"))
    ? FileImage
    : FileText

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const nextErrors = {}
    const trimmedTitle = formData.title.trim()

    if (!formData.code.trim()) {
      nextErrors.code = "Mã bài giảng là bắt buộc"
    } else if (!/^BG\d+$/i.test(formData.code.trim())) {
      nextErrors.code = "Mã bài giảng phải bắt đầu bằng BG và chỉ chứa số sau BG"
    }

    if (!trimmedTitle) {
      nextErrors.title = "Tên bài giảng là bắt buộc"
    } else if (trimmedTitle.length < MIN_TITLE_LENGTH) {
      nextErrors.title = `Tên bài giảng phải có ít nhất ${MIN_TITLE_LENGTH} ký tự`
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      nextErrors.title = `Tên bài giảng không được vượt quá ${MAX_TITLE_LENGTH} ký tự`
    } else if (!LESSON_TITLE_PATTERN.test(formData.title)) {
      nextErrors.title = "Tên bài giảng chỉ được chứa chữ, số và khoảng trắng"
    }

    if (!formData.topic) {
      nextErrors.topic = "Môn học là bắt buộc"
    }

    const trimmedDuration = formData.duration.trim()
    if (trimmedDuration) {
      if (trimmedDuration.length > MAX_DURATION_LENGTH) {
        nextErrors.duration = `Thời lượng không được vượt quá ${MAX_DURATION_LENGTH} ký tự`
      } else if (!DURATION_PATTERN.test(trimmedDuration)) {
        nextErrors.duration = "Thời lượng chỉ được chứa chữ, số và khoảng trắng"
      }
    }

    if (!formData.date) {
      nextErrors.date = "Ngày học là bắt buộc"
    } else if (!dayjs(formData.date, "YYYY-MM-DD", true).isValid()) {
      nextErrors.date = "Ngày học phải có định dạng dd/mm/yyyy"
    }
    if (!formData.classId) {
      nextErrors.classId = "Lớp học là bắt buộc"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleAttachmentChange = (event) => {
    const nextFile = event.target.files?.[0] || null

    if (!nextFile) {
      setAttachmentFile(null)
      setAttachmentError("")
      return
    }

    const resolvedMimeType = resolveAttachmentMimeType(nextFile)

    if (!resolvedMimeType) {
      setAttachmentFile(null)
      setAttachmentError("Chỉ hỗ trợ ảnh hoặc tài liệu Word (.doc, .docx)")
      return
    }

    if (nextFile.size > MAX_ATTACHMENT_SIZE) {
      setAttachmentFile(null)
      setAttachmentError("Tệp đính kèm vượt quá 8MB")
      return
    }

    setAttachmentFile({ file: nextFile, mimeType: resolvedMimeType })
    setAttachmentError("")
    setRemoveAttachment(false)
  }

  const handleRemoveAttachment = () => {
    setAttachmentFile(null)
    setAttachmentError("")
    setRemoveAttachment(true)
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    let attachment = lesson?.attachment || null

    if (attachmentFile) {
      const dataUrl = await readFileAsDataUrl(attachmentFile.file)
      const normalizedDataUrl = dataUrl.replace(/^data:[^;]*;base64,/, `data:${attachmentFile.mimeType};base64,`)
      attachment = {
        fileName: attachmentFile.file.name,
        mimeType: attachmentFile.mimeType,
        size: attachmentFile.file.size,
        dataUrl: normalizedDataUrl,
      }
    } else if (removeAttachment) {
      attachment = null
    }

    const isSubmitted = await onSubmit({
      ...lesson,
      code: formData.code.trim(),
      title: formData.title.trim(),
      classId: formData.classId,
      topic: formData.topic,
      date: formData.date,
      duration: formData.duration.trim(),
      attachment,
      removeAttachment,
    })

    if (isSubmitted !== false) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-170 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? "Cập nhật bài giảng" : "Tạo bài giảng mới"}</DialogTitle>
          <DialogDescription>
            Điền thông tin bài giảng cho lớp học đã chọn.
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
              {errors.code ? <p className="text-xs text-destructive">{errors.code}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Ngày *</Label>
              <DatePicker
                value={formData.date}
                onChange={(value) => handleChange("date", value)}
                placeholder="dd/mm/yyyy"
              />
              {errors.date ? <p className="text-xs text-destructive">{errors.date}</p> : null}
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
            {errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Thời lượng</Label>
            <Input
              id="duration"
              placeholder="Ví dụ: 45 phút"
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Môn học *</Label>
              <Select value={formData.topic} onValueChange={(value) => handleChange("topic", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.topic ? <p className="text-xs text-destructive">{errors.topic}</p> : null}
            </div>
            <div className="space-y-2">
              <Label>Tài liệu bài giảng</Label>
              <label htmlFor="lesson-attachment" className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input bg-muted/20 px-3 py-2 text-sm hover:bg-muted/40">
                <span className="flex size-9 items-center justify-center rounded-md bg-background text-muted-foreground">
                  <Paperclip className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{attachmentLabel}</span>
                  <span className="block text-xs text-muted-foreground">Hỗ trợ ảnh hoặc tài liệu Word (.doc, .docx)</span>
                </span>
                <AttachmentIcon className="size-4 text-muted-foreground" />
                <Input
                  id="lesson-attachment"
                  type="file"
                  accept=".doc,.docx,image/*"
                  onChange={handleAttachmentChange}
                  className="hidden"
                />
              </label>
              {lesson?.attachment && !attachmentFile && !removeAttachment ? (
                <Button type="button" variant="ghost" size="xs" className="px-0 text-destructive hover:text-destructive" onClick={handleRemoveAttachment}>
                  Gỡ tài liệu hiện tại
                </Button>
              ) : null}
              {attachmentError ? <p className="text-xs text-destructive">{attachmentError}</p> : null}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {lesson ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

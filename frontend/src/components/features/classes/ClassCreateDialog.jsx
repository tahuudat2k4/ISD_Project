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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialFormState = {
  malop: "",
  tenlop: "",
  giaoVienId: "",
}

export function ClassCreateDialog({
  open,
  onOpenChange,
  onSubmit,
  gradeLabel,
  teachers = [],
  submitting = false,
}) {
  const [form, setForm] = React.useState(initialFormState)

  React.useEffect(() => {
    if (!open) {
      setForm(initialFormState)
    }
  }, [open])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await onSubmit({
      malop: form.malop.trim(),
      tenlop: form.tenlop.trim(),
      giaoVienId: form.giaoVienId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="size-5 text-emerald-600" />
            Thêm lớp mới
          </DialogTitle>
          <DialogDescription>
            Tạo lớp thật trong hệ thống cho khối {gradeLabel || "đã chọn"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="gradeName">Khối lớp</Label>
            <Input id="gradeName" value={gradeLabel || "Chưa xác định"} disabled />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="malop">Mã lớp</Label>
            <Input
              id="malop"
              value={form.malop}
              onChange={(event) => setForm((prev) => ({ ...prev, malop: event.target.value }))}
              placeholder="Ví dụ: MAM01"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tenlop">Tên lớp</Label>
            <Input
              id="tenlop"
              value={form.tenlop}
              onChange={(event) => setForm((prev) => ({ ...prev, tenlop: event.target.value }))}
              placeholder="Ví dụ: Mầm 1A"
              disabled={submitting}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="giaoVienId">Giáo viên chủ nhiệm</Label>
            <Select
              value={form.giaoVienId}
              onValueChange={(value) => setForm((prev) => ({ ...prev, giaoVienId: value }))}
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
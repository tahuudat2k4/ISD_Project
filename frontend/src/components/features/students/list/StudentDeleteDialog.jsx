import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function StudentDeleteDialog({
  open,
  onOpenChange,
  student,
  onConfirm,
  submitting = false,
}) {
  if (!student) {
    return null
  }

  const canDelete = student.status === "Nghỉ học"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{canDelete ? "Xác nhận xóa học sinh" : "Không thể xóa học sinh"}</DialogTitle>
          <DialogDescription>
            {canDelete
              ? `Bạn có chắc chắn muốn xóa học sinh ${student.name} (${student.code}) không? Hành động này không thể hoàn tác.`
              : `Học sinh ${student.name} (${student.code}) hiện đang ở trạng thái ${student.status || "Đang học"}. Hãy chuyển trạng thái sang Nghỉ học trước khi xóa.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            {canDelete ? "Hủy" : "Đóng"}
          </Button>
          {canDelete ? (
            <Button type="button" variant="destructive" onClick={onConfirm} disabled={submitting}>
              {submitting ? "Đang xóa..." : "Xóa học sinh"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
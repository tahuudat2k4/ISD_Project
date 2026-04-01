import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ClassDeleteDialog({
  open,
  onOpenChange,
  classItem,
  onConfirm,
  submitting = false,
}) {
  if (!classItem) {
    return null
  }

  const canDelete = classItem.status === "Tạm dừng" || classItem.status === "Kế hoạch"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{canDelete ? "Xác nhận xóa lớp học" : "Không thể xóa lớp học"}</DialogTitle>
          <DialogDescription>
            {canDelete
              ? `Bạn có chắc chắn muốn xóa lớp ${classItem.name} (${classItem.code}) không? Hành động này không thể hoàn tác.`
              : `Lớp ${classItem.name} (${classItem.code}) đang ở trạng thái Hoạt động. Hãy chuyển trạng thái sang Tạm dừng hoặc Kế hoạch trước khi xóa.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            {canDelete ? "Hủy" : "Đóng"}
          </Button>
          {canDelete ? (
            <Button type="button" variant="destructive" onClick={onConfirm} disabled={submitting}>
              {submitting ? "Đang xóa..." : "Xóa lớp"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
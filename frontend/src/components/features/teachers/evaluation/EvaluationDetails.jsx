import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const CRITERIA_LABELS = {
  teaching: "Năng lực giảng dạy",
  student_care: "Chăm sóc học sinh",
  discipline: "Kỷ luật làm việc",
  teamwork: "Làm việc nhóm",
}

function getScoreBadge(score) {
  if (score >= 9) {
    return <Badge className="bg-green-500">Xuất sắc</Badge>
  } else if (score >= 8) {
    return <Badge className="bg-blue-500">Tốt</Badge>
  } else if (score >= 7) {
    return <Badge className="bg-yellow-500">Khá</Badge>
  } else if (score >= 5) {
    return <Badge variant="secondary">Trung bình</Badge>
  } else {
    return <Badge variant="destructive">Cần cải thiện</Badge>
  }
}

export function EvaluationDetails({ open, onOpenChange, teacher }) {
  if (!teacher) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá</DialogTitle>
          <DialogDescription>
            {teacher.name} - {teacher.role}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Overall Score */}
          <div className="rounded-lg bg-muted p-4 text-center">
            <div className="text-sm text-muted-foreground mb-2">Điểm tổng kết</div>
            <div className="text-4xl font-bold text-primary mb-2">{teacher.score}/10</div>
            {getScoreBadge(teacher.score)}
          </div>

          <Separator />

          {/* Detailed Scores */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Chi tiết điểm số</div>
            {teacher.detailedScores && Object.entries(teacher.detailedScores).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {CRITERIA_LABELS[key]}
                </span>
                <span className="font-semibold">{value}/10</span>
              </div>
            ))}
          </div>

          {/* Comment */}
          {teacher.comment && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium">Nhận xét</div>
                <p className="text-sm text-muted-foreground">{teacher.comment}</p>
              </div>
            </>
          )}

          {/* Evaluation Info */}
          <Separator />
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>Người đánh giá: {teacher.evaluatedBy || "Admin"}</div>
            <div>Ngày đánh giá: {teacher.evaluatedDate || "02/02/2026"}</div>
            <div>Kỳ đánh giá: {teacher.period || "Kỳ 1 - 2026"}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

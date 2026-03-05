import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CheckCircle2 } from "lucide-react"

function getScoreBadge(score) {
  if (score >= 9) return <Badge className="bg-purple-500">Xuất sắc</Badge>
  if (score >= 8) return <Badge className="bg-green-500">Tốt</Badge>
  if (score >= 7) return <Badge className="bg-blue-500">Khá</Badge>
  if (score >= 5) return <Badge variant="secondary">TB</Badge>
  return <Badge variant="destructive">Cần cải thiện</Badge>
}

export function StudentRecordsDetails({ open, onOpenChange, record }) {
  if (!record) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết học bạ</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Header Info */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Học sinh</div>
                <div className="text-lg font-bold">{record.name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Mã số</div>
                <div className="font-medium">{record.code}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Badge variant="outline">{record.className}</Badge>
              <Badge variant="secondary">Chuyên cần: {record.attendance}</Badge>
              <Badge className="bg-green-500">Hạnh kiểm: {record.behavior}</Badge>
            </div>
          </div>

          <Separator />

          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-2">
                  <BarChart3 className="size-4" />
                  Điểm trung bình
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{record.averageScore.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {getScoreBadge(record.averageScore)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Tình trạng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{record.behavior}</div>
                <div className="text-xs text-muted-foreground mt-1">Hạnh kiểm tốt</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Subjects */}
          <div>
            <h3 className="font-medium mb-3 text-sm">Điểm các môn học</h3>
            <div className="space-y-2">
              {record.subjects.map((subject) => (
                <div
                  key={subject.name}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{subject.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-base">{subject.score.toFixed(1)}</div>
                    <div className="text-xs mt-1">{getScoreBadge(subject.score)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <h3 className="font-medium mb-2 text-sm">Nhận xét của giáo viên</h3>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">{record.notes}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

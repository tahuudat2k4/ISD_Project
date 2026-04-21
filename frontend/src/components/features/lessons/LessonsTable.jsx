import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Pencil, Plus, Trash2 } from "lucide-react"

export function LessonsTable({
  lessons,
  onViewDetails,
  onEditLesson,
  onDeleteLesson,
  onCreateLesson,
  canCreateLesson = false,
  createDisabledReason = "",
  deletingLessonId = "",
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Danh sách bài giảng</CardTitle>
          {createDisabledReason ? (
            <p className="mt-1 text-xs text-muted-foreground">{createDisabledReason}</p>
          ) : null}
        </div>
        <Button onClick={onCreateLesson} disabled={!canCreateLesson} size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Thêm bài giảng
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {!lessons || lessons.length === 0 ? (
          <div className="flex h-40 items-center justify-center px-4">
            <p className="text-sm text-muted-foreground">Không có bài giảng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Mã</TableHead>
                  <TableHead>Tên bài giảng</TableHead>
                  <TableHead className="w-25">Lớp</TableHead>
                  <TableHead className="w-35">Giáo viên</TableHead>
                  <TableHead className="w-25">Ngày</TableHead>
                  <TableHead className="w-32 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium text-xs">{lesson.code}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium text-sm">{lesson.title}</div>
                        <div className="text-xs text-muted-foreground">{lesson.topic}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {lesson.className}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{lesson.teacher}</TableCell>
                    <TableCell className="text-xs">{lesson.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onViewDetails(lesson)}
                          title="Xem chi tiết"
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onEditLesson(lesson)}
                          disabled={!lesson.canManageClass}
                          title={lesson.canManageClass ? "Chỉnh sửa" : "Bạn không thể chỉnh sửa bài giảng này"}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onDeleteLesson(lesson)}
                          disabled={!lesson.canManageClass || deletingLessonId === lesson.id}
                          title={lesson.canManageClass ? "Xóa bài giảng" : "Bạn không thể xóa bài giảng này"}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

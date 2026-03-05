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
import { Eye, Pencil, Trash2 } from "lucide-react"

function getStatusBadge(status) {
  if (status === "Đang dạy") {
    return <Badge className="bg-orange-500">Đang dạy</Badge>
  } else if (status === "Sắp tới") {
    return <Badge className="bg-blue-500">Sắp tới</Badge>
  } else {
    return <Badge className="bg-green-500">Đã hoàn thành</Badge>
  }
}

export function LessonsTable({ lessons, onViewDetails, onEdit, onDelete }) {
  if (!lessons || lessons.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">Không có bài giảng</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Danh sách bài giảng</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã</TableHead>
                <TableHead>Tên bài giảng</TableHead>
                <TableHead className="w-[100px]">Lớp</TableHead>
                <TableHead className="w-[140px]">Giáo viên</TableHead>
                <TableHead className="w-[100px]">Ngày</TableHead>
                <TableHead className="w-[90px]">Trạng thái</TableHead>
                <TableHead className="text-right w-[140px]">Thao tác</TableHead>
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
                  <TableCell>{getStatusBadge(lesson.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onViewDetails(lesson)}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onEdit(lesson)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onDelete(lesson)}
                        className="text-destructive hover:text-destructive"
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
      </CardContent>
    </Card>
  )
}

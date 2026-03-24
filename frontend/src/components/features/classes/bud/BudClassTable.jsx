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
  if (status === "Hoạt động") {
    return <Badge className="bg-green-500">Hoạt động</Badge>
  } else if (status === "Tạm dừng") {
    return <Badge className="bg-orange-500">Tạm dừng</Badge>
  } else {
    return <Badge variant="secondary">Kế hoạch</Badge>
  }
}

export function BudClassTable({ classes, onEdit, onDelete, onViewDetails, canManageClasses }) {
  if (!classes || classes.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">Không tìm thấy lớp học</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Danh sách lớp chồi</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Mã lớp</TableHead>
                <TableHead className="w-[120px]">Tên lớp</TableHead>
                <TableHead className="w-[120px]">Giáo viên chủ</TableHead>
                <TableHead className="w-[100px]">Học sinh</TableHead>
                <TableHead className="w-[100px]">Phòng</TableHead>
                <TableHead className="w-[80px]">Trạng thái</TableHead>
                <TableHead className="text-right w-[140px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium text-xs">{classItem.code}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">{classItem.name}</div>
                      <div className="text-xs text-muted-foreground">{classItem.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{classItem.mainTeacher}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{classItem.currentStudents}</div>
                    <div className="text-xs text-muted-foreground">
                      / {classItem.capacity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {classItem.room}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(classItem.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onViewDetails(classItem)}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      {canManageClasses ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onEdit(classItem)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onDelete(classItem)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </>
                      ) : null}
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

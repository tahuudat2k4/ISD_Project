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

function getHealthBadge(health) {
  if (health === "Tốt") {
    return <Badge className="bg-green-500">Tốt</Badge>
  } else if (health === "Khá") {
    return <Badge className="bg-blue-500">Khá</Badge>
  } else {
    return <Badge variant="secondary">Trung bình</Badge>
  }
}

export function StudentListTable({ students, onEdit, onDelete, onViewDetails, canManageStudents }) {
  if (!students || students.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">Không tìm thấy học sinh</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Danh sách học sinh</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã số</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead className="w-[80px]">Giới tính</TableHead>
                <TableHead className="w-[100px]">Ngày sinh</TableHead>
                <TableHead className="w-[120px]">Lớp</TableHead>
                <TableHead className="w-[100px]">Sức khỏe</TableHead>
                <TableHead className="hidden lg:table-cell">Số điện thoại</TableHead>
                <TableHead className="text-right w-[140px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-xs">{student.code}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {student.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{student.dob}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {student.className}
                    </Badge>
                  </TableCell>
                  <TableCell>{getHealthBadge(student.health)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">
                    {student.phone}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onViewDetails(student)}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      {canManageStudents ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onEdit(student)}
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onDelete(student)}
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

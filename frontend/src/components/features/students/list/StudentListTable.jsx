import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Pencil, Search, Trash2 } from "lucide-react"

function getHealthBadge(health) {
  if (health === "Tốt") {
    return <Badge className="bg-green-500">Tốt</Badge>
  } else if (health === "Khá") {
    return <Badge className="bg-blue-500">Khá</Badge>
  } else {
    return <Badge variant="secondary">Trung bình</Badge>
  }
}

export function StudentListTable({
  students,
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  classOptions = [],
  onEdit,
  onDelete,
  onViewDetails,
  canManageStudents,
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 pb-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-base">Danh sách học sinh</CardTitle>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="relative w-full sm:w-70">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc mã số..."
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedClass} onValueChange={onClassChange}>
              <SelectTrigger className="w-full sm:w-45">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {classOptions.map((cls) => (
                  <SelectItem key={cls.code} value={cls.code}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {students && students.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-25">Mã số</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead className="w-20">Giới tính</TableHead>
                  <TableHead className="w-25">Ngày sinh</TableHead>
                  <TableHead className="w-30">Lớp</TableHead>
                  <TableHead className="w-25">Sức khỏe</TableHead>
                  <TableHead className="hidden lg:table-cell">Số điện thoại</TableHead>
                  <TableHead className="text-right w-35">Thao tác</TableHead>
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
        ) : (
          <div className="flex h-40 items-center justify-center px-6 py-8">
            <p className="text-sm text-muted-foreground">Không tìm thấy học sinh</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

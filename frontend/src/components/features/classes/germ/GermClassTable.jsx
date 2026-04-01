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
import { CLASS_STATUSES } from "../classViewModel"

function getStatusBadge(status) {
  if (status === "Hoạt động") {
    return <Badge className="bg-green-500">Hoạt động</Badge>
  } else if (status === "Tạm dừng") {
    return <Badge className="bg-orange-500">Tạm dừng</Badge>
  } else {
    return <Badge variant="secondary">Kế hoạch</Badge>
  }
}

export function GermClassTable({
  classes,
  onEdit,
  onDelete,
  onViewDetails,
  canManageClasses,
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-4 pb-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-base">Danh sách lớp mầm</CardTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:min-w-[460px]">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc mã lớp..."
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                {CLASS_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Mã lớp</TableHead>
                <TableHead className="w-[120px]">Tên lớp</TableHead>
                <TableHead className="w-[100px]">Giáo viên chủ</TableHead>
                <TableHead className="w-[100px]">Học sinh</TableHead>
                <TableHead className="w-[80px]">Trạng thái</TableHead>
                <TableHead className="text-right w-[140px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length > 0 ? (
                classes.map((classItem) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm text-muted-foreground">
                    Không tìm thấy lớp học
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

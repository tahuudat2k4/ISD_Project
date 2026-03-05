import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock, Save, RotateCcw } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function getStatusBadge(status) {
  if (status === "Có mặt") {
    return <Badge className="bg-green-500">Có mặt</Badge>
  } else if (status === "Đi muộn") {
    return <Badge className="bg-orange-500">Đi muộn</Badge>
  } else if (status === "Vắng") {
    return <Badge variant="destructive">Vắng</Badge>
  } else {
    return <Badge variant="outline">Chưa điểm danh</Badge>
  }
}

export function AttendanceMarkingTable({ 
  records, 
  onStatusChange,
  onSave,
  onReset,
  hasChanges,
  isSaving,
  selectedDate,
  onDateChange,
  className = ""
}) {
  if (!records || records.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">Không có học sinh trong lớp này</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Danh sách điểm danh</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Ngày</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={!hasChanges || isSaving}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              Hủy thay đổi
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              disabled={!hasChanges || isSaving}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="size-4" />
              {isSaving ? "Đang lưu..." : "Lưu điểm danh"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px]">STT</TableHead>
                <TableHead className="w-[100px]">Mã số</TableHead>
                <TableHead className="flex-1">Họ tên</TableHead>
                <TableHead className="w-[120px]">Trạng thái</TableHead>
                <TableHead className="text-center w-[280px]">Điểm danh nhanh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={record.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-xs text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{record.studentCode}</TableCell>
                  <TableCell className="text-sm font-medium">{record.studentName}</TableCell>
                  <TableCell>
                    {getStatusBadge(record.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant={record.status === "Có mặt" ? "default" : "outline"}
                        size="sm"
                        className={`gap-1.5 ${
                          record.status === "Có mặt" 
                            ? "bg-green-500 hover:bg-green-600" 
                            : ""
                        }`}
                        onClick={() => onStatusChange(record.id, "Có mặt")}
                      >
                        <Check className="size-3.5" />
                        <span className="hidden sm:inline">Có mặt</span>
                      </Button>

                      <Button
                        variant={record.status === "Đi muộn" ? "default" : "outline"}
                        size="sm"
                        className={`gap-1.5 ${
                          record.status === "Đi muộn" 
                            ? "bg-orange-500 hover:bg-orange-600" 
                            : ""
                        }`}
                        onClick={() => onStatusChange(record.id, "Đi muộn")}
                      >
                        <Clock className="size-3.5" />
                        <span className="hidden sm:inline">Muộn</span>
                      </Button>

                      <Button
                        variant={record.status === "Vắng" ? "default" : "outline"}
                        size="sm"
                        className={`gap-1.5 ${
                          record.status === "Vắng" 
                            ? "bg-red-500 hover:bg-red-600" 
                            : ""
                        }`}
                        onClick={() => onStatusChange(record.id, "Vắng")}
                      >
                        <X className="size-3.5" />
                        <span className="hidden sm:inline">Vắng</span>
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, RotateCcw } from "lucide-react"
import { ratingOptions } from "./ratingData"

export function RatingTable({
  records,
  onRatingChange,
  onSave,
  onReset,
  hasChanges,
  isSaving,
  canEdit = true,
  disabledReason = "",
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
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">Danh sách xếp loại</CardTitle>
            {!canEdit && disabledReason ? (
              <p className="mt-1 text-xs text-muted-foreground">{disabledReason}</p>
            ) : null}
          </div>
          <div className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={!canEdit || !hasChanges || isSaving}
              className="gap-2"
            >
              <RotateCcw className="size-4" />
              Hủy thay đổi
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              disabled={!canEdit || !hasChanges || isSaving}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="size-4" />
              {isSaving ? "Đang lưu..." : "Lưu xếp loại"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20">STT</TableHead>
                <TableHead className="w-30">Mã số</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead className="w-50">Xếp loại</TableHead>
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
                    <Select
                      value={record.rating || "UNRATED"}
                      onValueChange={(value) => onRatingChange(record.id, value === "UNRATED" ? "" : value)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger size="sm" className="w-42">
                        <SelectValue placeholder="Chọn xếp loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNRATED">Chưa xếp loại</SelectItem>
                        {ratingOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

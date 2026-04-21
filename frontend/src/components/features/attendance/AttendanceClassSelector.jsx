import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"

export function AttendanceClassSelector({
  selectedClass,
  onClassChange,
  searchTerm,
  onSearchChange,
  selectedDate,
  onDateChange,
  classOptions = [],
  accessScope = "all",
  loading = false,
  onPreviousDate,
  onNextDate,
}) {
  return (
    <Card>
      <CardContent className="p-4 lg:p-5">
        <div className="grid gap-4 xl:grid-cols-12 xl:items-end">
          <div className="xl:col-span-5">
            <label className="mb-2 block text-sm font-medium">Tìm học sinh</label>
            <div className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3">
                <Search className="size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc mã..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  disabled={loading}
                  className="h-6 flex-1 border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
                />
              </div>
          </div>

          <div className="xl:col-span-4">
            <label className="mb-2 block text-sm font-medium">Ngày điểm danh</label>
            <div className="flex items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onPreviousDate}
                  disabled={loading}
                  className="size-10 shrink-0"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <div className="flex-1">
                  <DatePicker
                    value={selectedDate}
                    onChange={onDateChange}
                    placeholder="Chọn ngày điểm danh"
                    disabled={loading}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onNextDate}
                  disabled={loading}
                  className="size-10 shrink-0"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3">
            <label className="mb-2 block text-sm font-medium">Chọn lớp học</label>
            <Select value={selectedClass} onValueChange={onClassChange} disabled={loading || !classOptions.length}>
              <SelectTrigger size="sm" className="h-10 w-full">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id} disabled={!cls.canManage}>
                    {cls.name}{accessScope === "teacher" && cls.canManage ? " (lớp của bạn)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

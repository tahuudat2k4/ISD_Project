import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function RatingFilters({
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedDate,
  onDateChange,
  classOptions = [],
  isLoadingClasses = false,
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 min-w-50">
              <label className="text-sm font-medium mb-2 block">Tìm học sinh</label>
              <div className="flex items-center gap-2 border border-input rounded-md px-3 py-2">
                <Search className="size-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc mã..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="h-6 text-sm border-0 bg-transparent focus-visible:ring-0 flex-1"
                />
              </div>
            </div>

            <div className="min-w-45">
              <label className="text-sm font-medium mb-2 block">Chọn lớp</label>
              <Select value={selectedClass} onValueChange={onClassChange}>
                <SelectTrigger size="sm" className="h-10">
                  <SelectValue placeholder={isLoadingClasses ? "Đang tải lớp..." : "Chọn lớp"} />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.isCurrentTeacherClass ? `${classItem.name} (lớp của bạn)` : classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-40">
              <label className="text-sm font-medium mb-2 block">Ngày</label>
              <DatePicker
                value={selectedDate}
                onChange={onDateChange}
                placeholder="Chọn ngày đánh giá"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

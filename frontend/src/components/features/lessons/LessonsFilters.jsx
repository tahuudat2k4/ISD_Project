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
import { topics } from "./lessonsData"

export function LessonsFilters({
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedTopic,
  onTopicChange,
  selectedDate,
  onDateChange,
  classOptions = [],
  isLoadingClasses = false,
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 min-w-50">
            <label className="text-xs text-muted-foreground mb-1 block">Tìm bài giảng</label>
            <div className="flex items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc mã..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-32.5">
              <label className="text-xs text-muted-foreground mb-1 block">Lớp</label>
              <Select value={selectedClass} onValueChange={onClassChange} disabled={isLoadingClasses}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder={isLoadingClasses ? "Đang tải lớp..." : "Chọn lớp"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  {classOptions.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}{classItem.isCurrentTeacherClass ? " (lớp của bạn)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-32.5">
              <label className="text-xs text-muted-foreground mb-1 block">Chủ đề</label>
              <Select value={selectedTopic} onValueChange={onTopicChange}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả chủ đề</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-37.5">
              <label className="text-xs text-muted-foreground mb-1 block">Ngày</label>
              <DatePicker
                value={selectedDate}
                onChange={onDateChange}
                placeholder="Chọn ngày bài giảng"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

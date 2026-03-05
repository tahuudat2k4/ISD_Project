import { CalendarDays, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function ScheduleFilters({ selectedWeek, onWeekChange, selectedTeacher, onTeacherChange }) {
  const handlePrevWeek = () => {
    onWeekChange(selectedWeek - 1)
  }

  const handleNextWeek = () => {
    onWeekChange(selectedWeek + 1)
  }

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Lịch làm việc tuần</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedTeacher} onValueChange={onTeacherChange}>
              <SelectTrigger size="sm" className="w-[180px]">
                <SelectValue placeholder="Chọn giáo viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giáo viên</SelectItem>
                <SelectItem value="teacher1">Nguyễn Thị Lan</SelectItem>
                <SelectItem value="teacher2">Phạm Thị Thu</SelectItem>
                <SelectItem value="teacher3">Võ Minh Anh</SelectItem>
                <SelectItem value="teacher4">Đặng Thu Trang</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 rounded-md border">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handlePrevWeek}
                disabled={selectedWeek <= 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="px-2 text-xs font-medium">Tuần {selectedWeek}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleNextWeek}
                disabled={selectedWeek >= 52}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

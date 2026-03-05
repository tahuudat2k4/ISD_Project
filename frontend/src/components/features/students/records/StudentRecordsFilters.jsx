import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { allClasses, allSubjects } from "./studentRecordsData"

export function StudentRecordsFilters({
  searchTerm,
  onSearchChange,
  selectedClass,
  onClassChange,
  selectedSubject,
  onSubjectChange,
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground mb-1 block">Tìm học sinh</label>
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
            <div className="min-w-[130px]">
              <label className="text-xs text-muted-foreground mb-1 block">Lớp</label>
              <Select value={selectedClass} onValueChange={onClassChange}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  {allClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[130px]">
              <label className="text-xs text-muted-foreground mb-1 block">Môn học</label>
              <Select value={selectedSubject} onValueChange={onSubjectChange}>
                <SelectTrigger size="sm">
                  <SelectValue placeholder="Chọn môn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn</SelectItem>
                  {allSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

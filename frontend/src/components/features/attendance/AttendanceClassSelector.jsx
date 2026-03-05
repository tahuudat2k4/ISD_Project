import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { allClasses } from "./attendanceData"

export function AttendanceClassSelector({
  selectedClass,
  onClassChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Class Selection and Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 min-w-[200px]">
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

            <div className="min-w-[180px]">
              <label className="text-sm font-medium mb-2 block">Chọn lớp học</label>
              <Select value={selectedClass} onValueChange={onClassChange}>
                <SelectTrigger size="sm" className="h-10">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {allClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
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

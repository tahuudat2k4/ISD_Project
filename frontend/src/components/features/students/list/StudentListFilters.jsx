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

export function StudentListFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedGrade, 
  onGradeChange,
  selectedClass,
  onClassChange,
  classOptions = []
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm học sinh theo tên hoặc mã số..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedGrade} onValueChange={onGradeChange}>
              <SelectTrigger size="sm" className="w-[130px]">
                <SelectValue placeholder="Chọn khối" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khối</SelectItem>
                <SelectItem value="mam">Khối Mầm</SelectItem>
                <SelectItem value="choi">Khối Chồi</SelectItem>
                <SelectItem value="la">Khối Lá</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedClass} onValueChange={onClassChange}>
              <SelectTrigger size="sm" className="w-[130px]">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lớp</SelectItem>
                {classOptions.map((cls) => (
                  <SelectItem key={cls.code} value={cls.code}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

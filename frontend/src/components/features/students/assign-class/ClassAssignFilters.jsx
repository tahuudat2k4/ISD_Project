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
import { classOptions } from "./classAssignmentData"

export function ClassAssignFilters({
  searchTerm,
  onSearchChange,
  currentClass,
  onCurrentClassChange,
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">Lớp hiện tại</label>
            <Select value={currentClass} onValueChange={onCurrentClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
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
        </div>
      </CardContent>
    </Card>
  )
}

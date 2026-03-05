import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function EvaluationFilters({ searchTerm, onSearchChange, selectedPeriod, onPeriodChange, selectedStatus, onStatusChange }) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder="Tìm giáo viên..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger size="sm" className="w-[140px]">
                <SelectValue placeholder="Kỳ đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kỳ</SelectItem>
                <SelectItem value="2026-1">Kỳ 1 - 2026</SelectItem>
                <SelectItem value="2025-2">Kỳ 2 - 2025</SelectItem>
                <SelectItem value="2025-1">Kỳ 1 - 2025</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger size="sm" className="w-[130px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Đã đánh giá</SelectItem>
                <SelectItem value="pending">Chưa đánh giá</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

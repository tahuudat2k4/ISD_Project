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
import { CLASS_STATUSES } from "../classViewModel"

export function GermClassFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
}) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground mb-1 block">Tìm lớp học</label>
            <div className="flex items-center gap-2">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc mã lớp..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="min-w-[130px]">
            <label className="text-xs text-muted-foreground mb-1 block">Trạng thái</label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger size="sm">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {CLASS_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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

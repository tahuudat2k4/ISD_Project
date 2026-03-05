import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

const LEGEND_ITEMS = [
  { label: "Mầm 1", color: "bg-blue-100 border-blue-300" },
  { label: "Mầm 2", color: "bg-purple-100 border-purple-300" },
  { label: "Chồi 1", color: "bg-green-100 border-green-300" },
  { label: "Chồi 2", color: "bg-yellow-100 border-yellow-300" },
  { label: "Lá 1", color: "bg-pink-100 border-pink-300" },
]

export function ScheduleLegend() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Info className="size-4 text-muted-foreground" />
          <CardTitle className="text-sm">Chú thích lớp học</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {LEGEND_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`h-4 w-8 rounded border-2 ${item.color}`} />
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-2">
            <div className="h-4 w-8 rounded border border-dashed border-gray-300 bg-gray-50" />
            <span className="text-xs text-muted-foreground">Tiết trống</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

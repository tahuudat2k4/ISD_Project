import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function RatingStats({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng học sinh</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge className="bg-emerald-500 mx-auto mb-2">{stats.A}</Badge>
            <p className="text-xs text-muted-foreground">A - Xuất sắc</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge className="bg-blue-500 mx-auto mb-2">{stats.B}</Badge>
            <p className="text-xs text-muted-foreground">B - Khá</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge className="bg-amber-500 mx-auto mb-2">{stats.C}</Badge>
            <p className="text-xs text-muted-foreground">C - Đạt</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge className="bg-red-500 mx-auto mb-2">{stats.D}</Badge>
            <p className="text-xs text-muted-foreground">D - Cần cố gắng</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge variant="outline" className="mx-auto mb-2">{stats.unrated}</Badge>
            <p className="text-xs text-muted-foreground">Chưa xếp loại</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

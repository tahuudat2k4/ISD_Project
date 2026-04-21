import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ratingValues } from "./ratingData"

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
            <Badge className="bg-red-500 mx-auto mb-2">{stats[ratingValues.NOT_MET]}</Badge>
            <p className="text-xs text-muted-foreground">Chưa đạt</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge className="bg-amber-500 mx-auto mb-2">{stats[ratingValues.DEVELOPING]}</Badge>
            <p className="text-xs text-muted-foreground">Đang phát triển</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge className="bg-blue-500 mx-auto mb-2">{stats[ratingValues.MEETS]}</Badge>
            <p className="text-xs text-muted-foreground">Đạt yêu cầu</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge className="bg-emerald-500 mx-auto mb-2">{stats[ratingValues.EXCEEDS]}</Badge>
            <p className="text-xs text-muted-foreground">Vượt trội</p>
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

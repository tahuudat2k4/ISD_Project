import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye } from "lucide-react"

function getScoreBadge(score) {
  if (score >= 9) return <Badge className="bg-purple-500">Xuất sắc</Badge>
  if (score >= 8) return <Badge className="bg-green-500">Tốt</Badge>
  if (score >= 7) return <Badge className="bg-blue-500">Khá</Badge>
  if (score >= 5) return <Badge variant="secondary">TB</Badge>
  return <Badge variant="destructive">Cần cải thiện</Badge>
}

export function StudentRecordsTable({ records, onViewDetails }) {
  if (!records || records.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">Không tìm thấy học bạ</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Học bạ học sinh</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã số</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead className="w-[100px]">Lớp</TableHead>
                <TableHead className="w-[100px]">ĐTB</TableHead>
                <TableHead className="w-[100px]">Điều kiện</TableHead>
                <TableHead className="w-[80px]">Hiệu quả</TableHead>
                <TableHead className="text-right w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium text-xs">{record.code}</TableCell>
                  <TableCell className="text-sm">{record.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {record.className}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {record.averageScore.toFixed(1)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {record.attendance}
                    </Badge>
                  </TableCell>
                  <TableCell>{getScoreBadge(record.averageScore)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onViewDetails(record)}
                    >
                      <Eye className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

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

function getStatusBadge(status) {
  if (status === "Khỏe mạnh") {
    return <Badge className="bg-green-500">Khỏe mạnh</Badge>
  } else if (status === "Cần theo dõi") {
    return <Badge className="bg-orange-500">Cần theo dõi</Badge>
  } else {
    return <Badge variant="destructive">Cần điều trị</Badge>
  }
}

function getBMIStatus(height, weight) {
  const heightInM = height / 100
  const bmi = weight / (heightInM * heightInM)

  if (bmi < 18.5) return "Gầy"
  if (bmi < 25) return "Bình thường"
  if (bmi < 30) return "Thừa cân"
  return "Béo phì"
}

export function StudentHealthTable({ records, onViewDetails }) {
  if (!records || records.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <p className="text-sm text-muted-foreground">Không tìm thấy hồ sơ sức khỏe</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Hồ sơ sức khỏe</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã số</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead className="w-[80px]">Lớp</TableHead>
                <TableHead className="w-[60px]">Cao (cm)</TableHead>
                <TableHead className="w-[60px]">Nặng (kg)</TableHead>
                <TableHead className="w-[80px]">Tình trạng</TableHead>
                <TableHead className="hidden lg:table-cell w-[100px]">Mẫu máu</TableHead>
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
                  <TableCell className="text-xs">{record.height}</TableCell>
                  <TableCell className="text-xs">{record.weight}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">
                    <Badge variant="secondary">{record.bloodType}</Badge>
                  </TableCell>
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

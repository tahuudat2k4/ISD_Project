import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Syringe } from "lucide-react"

function getStatusBadge(status) {
  if (status === "Khỏe mạnh") {
    return <Badge className="bg-green-500">Khỏe mạnh</Badge>
  } else if (status === "Cần theo dõi") {
    return <Badge className="bg-orange-500">Cần theo dõi</Badge>
  } else {
    return <Badge variant="destructive">Cần điều trị</Badge>
  }
}

export function StudentHealthDetails({ open, onOpenChange, record }) {
  if (!record) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết sức khỏe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Header Info */}
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Học sinh</div>
                <div className="text-lg font-bold">{record.name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Mã số</div>
                <div className="font-medium">{record.code}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{record.className}</Badge>
              {getStatusBadge(record.status)}
            </div>
          </div>

          <Separator />

          {/* Physical Measurements */}
          <div>
            <h3 className="font-medium mb-3 text-sm">Số đo cơ thể</h3>
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground mb-1">Chiều cao</div>
                  <div className="text-2xl font-bold">{record.height}</div>
                  <div className="text-xs text-muted-foreground">cm</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground mb-1">Cân nặng</div>
                  <div className="text-2xl font-bold">{record.weight}</div>
                  <div className="text-xs text-muted-foreground">kg</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground mb-1">Mẫu máu</div>
                  <div className="text-2xl font-bold">{record.bloodType}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Medical Info */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs flex items-center gap-2">
                  <CheckCircle2 className="size-4" />
                  Tình trạng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">{getStatusBadge(record.status)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs">Dị ứng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">{record.allergies}</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Vaccinations */}
          <div>
            <h3 className="font-medium mb-3 text-sm flex items-center gap-2">
              <Syringe className="size-4" />
              Vắc xin đã tiêm
            </h3>
            <div className="flex flex-wrap gap-2">
              {record.vaccinations.map((vac) => (
                <Badge key={vac} className="bg-blue-500">
                  {vac}
                </Badge>
              ))}
            </div>
          </div>

          {record.medicalConditions.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3 text-sm flex items-center gap-2">
                  <AlertCircle className="size-4 text-orange-600" />
                  Bệnh lý / Tình trạng cần chú ý
                </h3>
                <div className="flex flex-wrap gap-2">
                  {record.medicalConditions.map((condition) => (
                    <Badge key={condition} variant="destructive">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Checkup Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-700 font-medium mb-1">Khám lần cuối</div>
              <div className="text-blue-900 font-medium">{record.lastCheckup}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-xs text-green-700 font-medium mb-1">Khám lần tới</div>
              <div className="text-green-900 font-medium">{record.nextCheckup}</div>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <h3 className="font-medium mb-2 text-sm">Ghi chú</h3>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">{record.notes}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

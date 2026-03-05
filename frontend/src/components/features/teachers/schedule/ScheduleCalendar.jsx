import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const DAYS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"]
const TIME_SLOTS = [
  { id: 1, label: "7:30 - 9:00", period: "Sáng" },
  { id: 2, label: "9:00 - 10:30", period: "Sáng" },
  { id: 3, label: "10:30 - 11:30", period: "Sáng" },
  { id: 4, label: "13:30 - 15:00", period: "Chiều" },
  { id: 5, label: "15:00 - 16:30", period: "Chiều" },
]

const CLASS_COLORS = {
  "Mầm 1": "bg-blue-100 border-blue-300 text-blue-700",
  "Mầm 2": "bg-purple-100 border-purple-300 text-purple-700",
  "Chồi 1": "bg-green-100 border-green-300 text-green-700",
  "Chồi 2": "bg-yellow-100 border-yellow-300 text-yellow-700",
  "Lá 1": "bg-pink-100 border-pink-300 text-pink-700",
}

function ScheduleCell({ classInfo }) {
  if (!classInfo) {
    return (
      <div className="h-20 rounded border border-dashed border-gray-200 bg-gray-50/50 p-2">
        <span className="text-xs text-muted-foreground">Trống</span>
      </div>
    )
  }

  const colorClass = CLASS_COLORS[classInfo.className] || "bg-gray-100 border-gray-300 text-gray-700"

  return (
    <div className={cn("h-20 rounded border-2 p-2 transition-all hover:shadow-md", colorClass)}>
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className="text-xs font-semibold">{classInfo.className}</div>
          <div className="text-[10px] opacity-80">{classInfo.subject}</div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-[9px] h-4 px-1">
            {classInfo.room}
          </Badge>
          <span className="text-[9px] opacity-70">{classInfo.students}HS</span>
        </div>
      </div>
    </div>
  )
}

export function ScheduleCalendar({ scheduleData }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Lịch dạy trong tuần</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header - Days of week */}
            <div className="grid grid-cols-6 border-b bg-muted/30">
              <div className="border-r p-2 text-center">
                <span className="text-xs font-medium text-muted-foreground">Khung giờ</span>
              </div>
              {DAYS.map((day) => (
                <div key={day} className="p-2 text-center">
                  <span className="text-xs font-semibold">{day}</span>
                </div>
              ))}
            </div>

            {/* Time slots and schedule */}
            {TIME_SLOTS.map((slot, slotIndex) => (
              <div
                key={slot.id}
                className={cn(
                  "grid grid-cols-6",
                  slotIndex !== TIME_SLOTS.length - 1 && "border-b"
                )}
              >
                {/* Time column */}
                <div className="flex flex-col items-center justify-center border-r bg-muted/20 p-2">
                  <span className="text-xs font-medium">{slot.label}</span>
                  <Badge variant="outline" className="mt-1 text-[9px] h-4">
                    {slot.period}
                  </Badge>
                </div>

                {/* Schedule cells for each day */}
                {DAYS.map((day, dayIndex) => {
                  const classInfo = scheduleData?.[dayIndex]?.[slotIndex]
                  return (
                    <div key={`${day}-${slot.id}`} className="p-2">
                      <ScheduleCell classInfo={classInfo} />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

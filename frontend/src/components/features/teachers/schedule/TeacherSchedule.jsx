import { useState } from "react"
import { ScheduleFilters } from "./ScheduleFilters"
import { ScheduleCalendar } from "./ScheduleCalendar"
import { ScheduleStats } from "./ScheduleStats"
import { ScheduleLegend } from "./ScheduleLegend"
import { mockScheduleData, mockStats } from "./scheduleData"

export function TeacherSchedule() {
  const [selectedWeek, setSelectedWeek] = useState(5) // Current week
  const [selectedTeacher, setSelectedTeacher] = useState("teacher1")

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Lịch làm việc</h1>
      </div>

      {/* Filters */}
      <ScheduleFilters
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        selectedTeacher={selectedTeacher}
        onTeacherChange={setSelectedTeacher}
      />

      {/* Stats */}
      <ScheduleStats stats={mockStats} />

      {/* Main content */}
      <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
        {/* Schedule Calendar */}
        <ScheduleCalendar scheduleData={mockScheduleData} />

        {/* Legend */}
        <ScheduleLegend />
      </div>
    </div>
  )
}

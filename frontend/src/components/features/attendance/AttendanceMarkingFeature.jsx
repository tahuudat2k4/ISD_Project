import { useEffect, useMemo, useState } from "react"
import { AttendanceClassSelector } from "./AttendanceClassSelector"
import { AttendanceMarkingTable } from "./AttendanceMarkingTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { attendanceService } from "@/services/attendanceService"
import { authService } from "@/services/authService"
import { toast } from "sonner"

const formatDateParts = (year, month, day) => {
  const normalizedYear = String(year).padStart(4, "0")
  const normalizedMonth = String(month).padStart(2, "0")
  const normalizedDay = String(day).padStart(2, "0")
  return `${normalizedYear}-${normalizedMonth}-${normalizedDay}`
}

const getTodayString = () => {
  const today = new Date()
  return formatDateParts(today.getFullYear(), today.getMonth() + 1, today.getDate())
}

const cloneRecords = (records = []) => records.map((record) => ({ ...record }))

const shiftDate = (dateString, amount) => {
  const [yearString, monthString, dayString] = String(dateString).split("-")
  const nextDate = new Date(Number(yearString), Number(monthString) - 1, Number(dayString))
  nextDate.setDate(nextDate.getDate() + amount)
  return formatDateParts(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate())
}

const buildStats = (records = []) => ({
  total: records.length,
  present: records.filter((record) => record.status === "Có mặt").length,
  late: records.filter((record) => record.status === "Đi muộn").length,
  absent: records.filter((record) => record.status === "Vắng").length,
  unmarked: records.filter((record) => !record.status).length,
})

export function AttendanceMarkingFeature() {
  const [classOptions, setClassOptions] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [attendanceData, setAttendanceData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [isLoadingRecords, setIsLoadingRecords] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedDate, setSelectedDate] = useState(getTodayString())
  const [accessScope, setAccessScope] = useState("all")
  const [manageableCount, setManageableCount] = useState(0)
  const currentUser = authService.getCurrentUser()

  useEffect(() => {
    const loadClassOptions = async () => {
      try {
        setIsLoadingClasses(true)
        const response = await attendanceService.getClasses()
        const nextClassOptions = response?.data || []
        const nextManageableClasses = nextClassOptions.filter((classItem) => classItem.canManage)

        setClassOptions(nextClassOptions)
        setAccessScope(response?.meta?.scope || (currentUser?.role === "TEACHER" ? "teacher" : "all"))
        setManageableCount(response?.meta?.manageableCount ?? nextManageableClasses.length)
        setSelectedClass((currentSelectedClass) => {
          const isCurrentSelectable = nextClassOptions.some(
            (classItem) => classItem.id === currentSelectedClass && classItem.canManage
          )

          if (isCurrentSelectable) {
            return currentSelectedClass
          }

          return nextManageableClasses[0]?.id || (currentUser?.role === "ADMIN" ? nextClassOptions[0]?.id || "" : "")
        })
      } catch (error) {
        console.error("Error loading attendance classes:", error)
        toast.error(error?.response?.data?.message || "Không thể tải danh sách lớp điểm danh")
      } finally {
        setIsLoadingClasses(false)
      }
    }

    loadClassOptions()
  }, [currentUser?.role])

  useEffect(() => {
    const selectedClassOption = classOptions.find((classItem) => classItem.id === selectedClass)

    if (!selectedClass || !selectedDate || !selectedClassOption?.canManage) {
      setAttendanceData([])
      setOriginalData([])
      return
    }

    const loadAttendanceRecords = async () => {
      try {
        setIsLoadingRecords(true)
        const response = await attendanceService.getRecords({
          classId: selectedClass,
          date: selectedDate,
        })
        const records = cloneRecords(response?.data?.records || [])
        setAttendanceData(records)
        setOriginalData(cloneRecords(records))
      } catch (error) {
        console.error("Error loading attendance records:", error)
        setAttendanceData([])
        setOriginalData([])
        toast.error(error?.response?.data?.message || "Không thể tải dữ liệu điểm danh")
      } finally {
        setIsLoadingRecords(false)
      }
    }

    loadAttendanceRecords()
  }, [classOptions, selectedClass, selectedDate])

  const filteredRecords = useMemo(() => {
    return attendanceData
      .filter((record) =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [attendanceData, searchTerm])

  const stats = useMemo(() => {
    return buildStats(attendanceData)
  }, [attendanceData])

  const hasChanges = useMemo(() => {
    return JSON.stringify(attendanceData) !== JSON.stringify(originalData)
  }, [attendanceData, originalData])

  const selectedClassOption = classOptions.find((classItem) => classItem.id === selectedClass)

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceData((prev) =>
      prev.map((record) =>
        record.id === studentId
          ? { ...record, status: newStatus }
          : record
      )
    )
  }

  const handleNoteChange = (studentId, nextNote) => {
    setAttendanceData((prev) =>
      prev.map((record) =>
        record.id === studentId
          ? { ...record, note: nextNote.slice(0, 255) }
          : record
      )
    )
  }

  const handleSave = async () => {
    if (!selectedClassOption?.canManage) {
      toast.error("Bạn không có quyền điểm danh lớp này")
      return
    }

    if (attendanceData.some((record) => !record.status)) {
      toast.error("Vui lòng chọn trạng thái cho tất cả học sinh trước khi lưu")
      return
    }

    setIsSaving(true)
    try {
      const response = await attendanceService.saveRecords({
        classId: selectedClass,
        date: selectedDate,
        records: attendanceData.map((record) => ({
          studentId: record.id,
          status: record.status,
          note: record.note,
        })),
      })
      const savedRecords = cloneRecords(response?.data?.records || [])
      setAttendanceData(savedRecords)
      setOriginalData(cloneRecords(savedRecords))
      toast.success(response?.message || `Đã lưu điểm danh cho ${selectedClassOption?.name}`)
    } catch (error) {
      console.error("Error saving attendance:", error)
      toast.error(error?.response?.data?.message || "Lỗi khi lưu điểm danh. Vui lòng thử lại.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setAttendanceData(cloneRecords(originalData))
  }

  const handlePreviousDate = () => {
    setSelectedDate((currentDate) => shiftDate(currentDate, -1))
  }

  const handleNextDate = () => {
    setSelectedDate((currentDate) => shiftDate(currentDate, 1))
  }

  const emptyStateMessage = currentUser?.role === "TEACHER"
    ? manageableCount > 0
      ? "Chọn lớp bạn phụ trách để bắt đầu điểm danh"
      : "Bạn chưa được phân công lớp chủ nhiệm nên chưa thể điểm danh"
    : "Vui lòng chọn một lớp để bắt đầu điểm danh"

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Điểm danh học sinh</h1>
      </div>

      <AttendanceClassSelector
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        classOptions={classOptions}
        accessScope={accessScope}
        loading={isLoadingClasses || isLoadingRecords || isSaving}
        onPreviousDate={handlePreviousDate}
        onNextDate={handleNextDate}
      />

      {selectedClassOption?.canManage ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
                <Badge className="bg-green-500 mx-auto mb-2">{stats.present}</Badge>
                <p className="text-xs text-muted-foreground">Có mặt</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Badge className="bg-orange-500 mx-auto mb-2">{stats.late}</Badge>
                <p className="text-xs text-muted-foreground">Đi muộn</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Badge variant="destructive" className="mx-auto mb-2">{stats.absent}</Badge>
                <p className="text-xs text-muted-foreground">Vắng</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Badge variant="outline" className="mx-auto mb-2">{stats.unmarked}</Badge>
                <p className="text-xs text-muted-foreground">Chưa điểm danh</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {selectedClassOption?.canManage ? (
        <>
          {isLoadingRecords ? (
            <Card>
              <CardContent className="flex items-center justify-center h-40">
                <p className="text-sm text-muted-foreground">Đang tải dữ liệu điểm danh...</p>
              </CardContent>
            </Card>
          ) : filteredRecords.length > 0 ? (
            <AttendanceMarkingTable
              records={filteredRecords}
              onStatusChange={handleStatusChange}
              onNoteChange={handleNoteChange}
              onSave={handleSave}
              onReset={handleReset}
              hasChanges={hasChanges}
              isSaving={isSaving}
              selectedDate={selectedDate}
              selectedClassName={selectedClassOption.name}
              selectedTeacherName={selectedClassOption.teacherName}
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-40">
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Không tìm thấy học sinh phù hợp" : "Không có học sinh trong lớp này"}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-sm text-muted-foreground">
              {isLoadingClasses ? "Đang tải danh sách lớp..." : emptyStateMessage}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

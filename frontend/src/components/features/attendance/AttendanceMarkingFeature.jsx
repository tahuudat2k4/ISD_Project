import { useState, useMemo, useCallback } from "react"
import { AttendanceClassSelector } from "./AttendanceClassSelector"
import { AttendanceMarkingTable } from "./AttendanceMarkingTable"
import { AttendanceNotification } from "./AttendanceNotification"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockAttendanceRecords } from "./attendanceData"

export function AttendanceMarkingFeature() {
  const [selectedClass, setSelectedClass] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [attendanceData, setAttendanceData] = useState(mockAttendanceRecords)
  const [originalData, setOriginalData] = useState(JSON.parse(JSON.stringify(mockAttendanceRecords)))
  const [isSaving, setIsSaving] = useState(false)
  const [notification, setNotification] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Filter records by class and search term
  const filteredRecords = useMemo(() => {
    if (!selectedClass) return []

    return attendanceData
      .filter((record) => record.className === selectedClass)
      .filter((record) =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [selectedClass, searchTerm, attendanceData])

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      present: filteredRecords.filter((r) => r.status === "Có mặt").length,
      late: filteredRecords.filter((r) => r.status === "Đi muộn").length,
      absent: filteredRecords.filter((r) => r.status === "Vắng").length,
      unmarked: filteredRecords.filter((r) => r.status === undefined || r.status === "").length,
    }
  }, [filteredRecords])

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(attendanceData) !== JSON.stringify(originalData)
  }, [attendanceData, originalData])

  // Handle status change for a student
  const handleStatusChange = useCallback((studentId, newStatus) => {
    setAttendanceData((prev) =>
      prev.map((record) =>
        record.id === studentId
          ? { ...record, status: newStatus }
          : record
      )
    )
  }, [])

  // Handle save attendance data
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would typically call an API to save the attendance data
      // Example: await attendanceService.saveAttendance({ classId, date, records: filteredRecords })

      setOriginalData(JSON.parse(JSON.stringify(attendanceData)))
      setNotification({
        type: "success",
        message: `Đã lưu điểm danh cho ${selectedClass} vào ngày ${selectedDate}. Tổng cộng: ${stats.total} học sinh.`,
      })

      setTimeout(() => setNotification(null), 4000)
    } catch (error) {
      setNotification({
        type: "error",
        message: "Lỗi khi lưu điểm danh. Vui lòng thử lại.",
      })
      setTimeout(() => setNotification(null), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle reset changes
  const handleReset = () => {
    setAttendanceData(JSON.parse(JSON.stringify(originalData)))
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Điểm danh học sinh</h1>
      </div>

      {/* Notification */}
      {notification && (
        <AttendanceNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Class Selector and Controls */}
      <AttendanceClassSelector
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Statistics */}
      {selectedClass && (
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
      )}

      {/* Attendance Marking Table */}
      {selectedClass ? (
        <>
          {filteredRecords.length > 0 ? (
            <AttendanceMarkingTable
              records={filteredRecords}
              onStatusChange={handleStatusChange}
              onSave={handleSave}
              onReset={handleReset}
              hasChanges={hasChanges}
              isSaving={isSaving}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
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
              Vui lòng chọn một lớp để bắt đầu điểm danh
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

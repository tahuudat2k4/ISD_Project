import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { RatingFilters } from "./RatingFilters"
import { RatingStats } from "./RatingStats"
import { RatingTable } from "./RatingTable"
import { Card, CardContent } from "@/components/ui/card"
import { authService } from "@/services/authService"
import { classService } from "@/services/classService"
import { evaluationService } from "@/services/evaluationService"
import { ratingValues } from "./ratingData"

const getTodayString = () => new Date().toISOString().split("T")[0]

export function RatingFeature() {
  const currentUser = authService.getCurrentUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState(getTodayString)
  const [ratings, setRatings] = useState([])
  const [originalRatings, setOriginalRatings] = useState([])
  const [classOptions, setClassOptions] = useState([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [isLoadingRatings, setIsLoadingRatings] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canManageSelectedClass, setCanManageSelectedClass] = useState(true)

  const canEditSelectedClass = currentUser?.role !== "TEACHER" || canManageSelectedClass

  const filteredRecords = useMemo(() => {
    return ratings
      .filter((record) =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [ratings, searchTerm])

  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      [ratingValues.NOT_MET]: filteredRecords.filter((r) => r.rating === ratingValues.NOT_MET).length,
      [ratingValues.DEVELOPING]: filteredRecords.filter((r) => r.rating === ratingValues.DEVELOPING).length,
      [ratingValues.MEETS]: filteredRecords.filter((r) => r.rating === ratingValues.MEETS).length,
      [ratingValues.EXCEEDS]: filteredRecords.filter((r) => r.rating === ratingValues.EXCEEDS).length,
      unrated: filteredRecords.filter((r) => !r.rating).length,
    }
  }, [filteredRecords])

  const hasChanges = useMemo(() => {
    return JSON.stringify(ratings) !== JSON.stringify(originalRatings)
  }, [ratings, originalRatings])

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true)
        const response = await classService.getClasses()
        const items = Array.isArray(response?.data) ? response.data : []
        const nextClassOptions = items
          .map((classItem) => ({
            id: classItem._id,
            name: classItem.tenlop,
            isCurrentTeacherClass:
              currentUser?.role === "TEACHER" &&
              Boolean(currentUser?.teacherId) &&
              String(classItem?.giaoVienId?._id || classItem?.giaoVienId || "") === String(currentUser?.teacherId || ""),
          }))
          .sort((firstClass, secondClass) => firstClass.name.localeCompare(secondClass.name, undefined, {
            numeric: true,
            sensitivity: "base",
          }))

        setClassOptions(nextClassOptions)
        setSelectedClass((currentSelectedClass) => {
          if (currentSelectedClass && nextClassOptions.some((classItem) => classItem.id === currentSelectedClass)) {
            return currentSelectedClass
          }

          return nextClassOptions[0]?.id || ""
        })
      } catch (error) {
        console.error("Error loading evaluation classes:", error)
        setClassOptions([])
        toast.error(error?.response?.data?.message || "Không thể tải danh sách lớp")
      } finally {
        setIsLoadingClasses(false)
      }
    }

    loadClasses()
  }, [currentUser?.role, currentUser?.teacherId])

  useEffect(() => {
    const loadRatings = async () => {
      if (!selectedClass || !selectedDate) {
        setRatings([])
        setOriginalRatings([])
        return
      }

      try {
        setIsLoadingRatings(true)
        const response = await evaluationService.getEvaluationRecords({
          classId: selectedClass,
          date: selectedDate,
        })
        const records = Array.isArray(response?.data) ? response.data : []
        const nextCanManage = Boolean(response?.meta?.class?.canManage ?? true)
        setRatings(records)
        setOriginalRatings(JSON.parse(JSON.stringify(records)))
        setCanManageSelectedClass(nextCanManage)
      } catch (error) {
        console.error("Error loading evaluation records:", error)
        setRatings([])
        setOriginalRatings([])
        setCanManageSelectedClass(false)
        toast.error(error?.response?.data?.message || "Không thể tải dữ liệu xếp loại")
      } finally {
        setIsLoadingRatings(false)
      }
    }

    loadRatings()
  }, [selectedClass, selectedDate])

  const handleRatingChange = useCallback((recordId, value) => {
    if (!canEditSelectedClass) {
      return
    }

    setRatings((prev) =>
      prev.map((record) =>
        record.id === recordId ? { ...record, rating: value } : record
      )
    )
  }, [canEditSelectedClass])

  const handleSave = async () => {
    if (!canEditSelectedClass) {
      toast.error("Bạn chỉ có thể xem xếp loại của lớp này, không thể chỉnh sửa dữ liệu")
      return
    }

    setIsSaving(true)
    try {
      const response = await evaluationService.saveEvaluationRecords({
        classId: selectedClass,
        date: selectedDate,
        records: ratings.map((record) => ({
          studentId: record.studentId,
          rating: record.rating || "",
        })),
      })

      setOriginalRatings(JSON.parse(JSON.stringify(ratings)))
      toast.success(response?.message || `Đã lưu xếp loại. Tổng: ${stats.total} học sinh.`)
    } catch (error) {
      console.error("Error saving evaluation records:", error)
      toast.error("Lỗi khi lưu xếp loại. Vui lòng thử lại.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setRatings(JSON.parse(JSON.stringify(originalRatings)))
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Xếp loại học sinh</h1>
      </div>

      <RatingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        classOptions={classOptions}
        isLoadingClasses={isLoadingClasses}
      />

      {selectedClass ? (
        <>
          <RatingStats stats={stats} />
          {isLoadingRatings ? (
            <Card>
              <CardContent className="flex items-center justify-center h-40">
                <p className="text-sm text-muted-foreground">Đang tải dữ liệu xếp loại...</p>
              </CardContent>
            </Card>
          ) : filteredRecords.length > 0 ? (
            <RatingTable
              records={filteredRecords}
              onRatingChange={handleRatingChange}
              onSave={handleSave}
              onReset={handleReset}
              hasChanges={hasChanges}
              isSaving={isSaving}
              canEdit={canEditSelectedClass}
              disabledReason="Chỉ lớp bạn phụ trách mới có thể đánh giá. Các lớp khác chỉ xem được danh sách."
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
              {isLoadingClasses ? "Đang tải danh sách lớp..." : "Vui lòng chọn một lớp để bắt đầu xếp loại"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

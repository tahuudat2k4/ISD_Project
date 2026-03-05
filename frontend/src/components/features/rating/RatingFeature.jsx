import { useMemo, useState, useCallback } from "react"
import { toast } from "sonner"
import { RatingFilters } from "./RatingFilters"
import { RatingStats } from "./RatingStats"
import { RatingTable } from "./RatingTable"
import { mockRatings } from "./ratingData"
import { Card, CardContent } from "@/components/ui/card"

export function RatingFeature() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState("2026-02-03")
  const [ratings, setRatings] = useState(mockRatings)
  const [originalRatings, setOriginalRatings] = useState(
    JSON.parse(JSON.stringify(mockRatings))
  )
  const [isSaving, setIsSaving] = useState(false)

  const filteredRecords = useMemo(() => {
    if (!selectedClass) return []

    return ratings
      .filter((record) => record.className === selectedClass)
      .filter((record) =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
  }, [ratings, searchTerm, selectedClass])

  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      A: filteredRecords.filter((r) => r.rating === "A").length,
      B: filteredRecords.filter((r) => r.rating === "B").length,
      C: filteredRecords.filter((r) => r.rating === "C").length,
      D: filteredRecords.filter((r) => r.rating === "D").length,
      unrated: filteredRecords.filter((r) => !r.rating).length,
    }
  }, [filteredRecords])

  const hasChanges = useMemo(() => {
    return JSON.stringify(ratings) !== JSON.stringify(originalRatings)
  }, [ratings, originalRatings])

  const handleRatingChange = useCallback((recordId, value) => {
    setRatings((prev) =>
      prev.map((record) =>
        record.id === recordId ? { ...record, rating: value } : record
      )
    )
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))

      setOriginalRatings(JSON.parse(JSON.stringify(ratings)))
      toast.success(
        `Đã lưu xếp loại lớp ${selectedClass} ngày ${selectedDate}. Tổng: ${stats.total} học sinh.`
      )
    } catch (error) {
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
      />

      {selectedClass ? (
        <>
          <RatingStats stats={stats} />
          {filteredRecords.length > 0 ? (
            <RatingTable
              records={filteredRecords}
              onRatingChange={handleRatingChange}
              onSave={handleSave}
              onReset={handleReset}
              hasChanges={hasChanges}
              isSaving={isSaving}
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
              Vui lòng chọn một lớp để bắt đầu xếp loại
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

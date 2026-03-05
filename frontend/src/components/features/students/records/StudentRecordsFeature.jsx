import { useState, useMemo } from "react"
import { StudentRecordsFilters } from "./StudentRecordsFilters"
import { StudentRecordsStats } from "./StudentRecordsStats"
import { StudentRecordsTable } from "./StudentRecordsTable"
import { StudentRecordsDetails } from "./StudentRecordsDetails"
import { mockStudentRecords } from "./studentRecordsData"

export function StudentRecordsFeature() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter records based on search and filters
  const filteredRecords = useMemo(() => {
    return mockStudentRecords.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClass = selectedClass === "all" || record.className === selectedClass

      const matchesSubject =
        selectedSubject === "all" ||
        record.subjects.some(
          (subject) =>
            subject.name.toLowerCase() === selectedSubject.toLowerCase()
        )

      return matchesSearch && matchesClass && matchesSubject
    })
  }, [searchTerm, selectedClass, selectedSubject])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      averageScore:
        filteredRecords.length > 0
          ? filteredRecords.reduce((sum, r) => sum + r.averageScore, 0) /
            filteredRecords.length
          : 0,
      excellent: filteredRecords.filter((r) => r.averageScore >= 9).length,
    }
  }, [filteredRecords])

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Học bạ học sinh</h1>
      </div>

      {/* Filters */}
      <StudentRecordsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
      />

      {/* Stats */}
      <StudentRecordsStats stats={stats} />

      {/* Table */}
      <StudentRecordsTable records={filteredRecords} onViewDetails={handleViewDetails} />

      {/* Details Modal */}
      <StudentRecordsDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        record={selectedRecord}
      />
    </div>
  )
}

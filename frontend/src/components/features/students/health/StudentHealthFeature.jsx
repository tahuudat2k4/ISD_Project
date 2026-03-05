import { useState, useMemo } from "react"
import { StudentHealthFilters } from "./StudentHealthFilters"
import { StudentHealthStats } from "./StudentHealthStats"
import { StudentHealthTable } from "./StudentHealthTable"
import { StudentHealthDetails } from "./StudentHealthDetails"
import { mockStudentHealth } from "./studentHealthData"

export function StudentHealthFeature() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter records based on search and filters
  const filteredRecords = useMemo(() => {
    return mockStudentHealth.filter((record) => {
      const matchesSearch =
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClass = selectedClass === "all" || record.className === selectedClass

      const matchesStatus =
        selectedStatus === "all" || record.status === selectedStatus

      return matchesSearch && matchesClass && matchesStatus
    })
  }, [searchTerm, selectedClass, selectedStatus])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      healthy: filteredRecords.filter((r) => r.status === "Khỏe mạnh").length,
      needsAttention: filteredRecords.filter(
        (r) => r.status === "Cần theo dõi" || r.status === "Cần điều trị"
      ).length,
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
        <h1 className="text-xl font-bold tracking-tight">Sức khỏe học sinh</h1>
      </div>

      {/* Filters */}
      <StudentHealthFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Stats */}
      <StudentHealthStats stats={stats} />

      {/* Table */}
      <StudentHealthTable records={filteredRecords} onViewDetails={handleViewDetails} />

      {/* Details Modal */}
      <StudentHealthDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        record={selectedRecord}
      />
    </div>
  )
}

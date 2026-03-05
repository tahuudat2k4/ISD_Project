import { useState } from "react"
import { EvaluationFilters } from "./EvaluationFilters"
import { EvaluationStats } from "./EvaluationStats"
import { EvaluationList } from "./EvaluationList"
import { EvaluationForm } from "./EvaluationForm"
import { EvaluationDetails } from "./EvaluationDetails"
import { mockTeachers, mockStats } from "./evaluationData"
import { toast } from "sonner"

export function TeacherEvaluation() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("2026-1")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter teachers based on search and filters
  const filteredTeachers = mockTeachers.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      selectedStatus === "all" ||
      teacher.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleEvaluate = (teacher) => {
    setSelectedTeacher(teacher)
    setIsFormOpen(true)
  }

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher)
    setIsDetailsOpen(true)
  }

  const handleSubmitEvaluation = (evaluationData) => {
    console.log("Evaluation submitted:", evaluationData)
    toast.success("Đánh giá đã được lưu thành công!")
    setIsFormOpen(false)
    setSelectedTeacher(null)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Đánh giá giáo viên</h1>
      </div>

      {/* Filters */}
      <EvaluationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Stats */}
      <EvaluationStats stats={mockStats} />

      {/* Teacher List */}
      <EvaluationList
        teachers={filteredTeachers}
        onEvaluate={handleEvaluate}
        onViewDetails={handleViewDetails}
      />

      {/* Evaluation Form Modal */}
      <EvaluationForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        teacher={selectedTeacher}
        onSubmit={handleSubmitEvaluation}
      />

      {/* Evaluation Details Modal */}
      <EvaluationDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        teacher={selectedTeacher}
      />
    </div>
  )
}

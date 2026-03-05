import { useState, useMemo } from "react"
import { ClassAssignFilters } from "./ClassAssignFilters"
import { ClassAssignStats } from "./ClassAssignStats"
import { ClassAssignTable } from "./ClassAssignTable"
import { ClassAssignForm } from "./ClassAssignForm"
import { mockClassStudents, classOptions } from "./classAssignmentData"
import { toast } from "sonner"

export function ClassAssignFeature() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentClass, setCurrentClass] = useState("mam1")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Get students for current class
  const students = mockClassStudents[currentClass] || []

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [students, searchTerm])

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: students.length,
      male: students.filter((s) => s.gender === "Nam").length,
      female: students.filter((s) => s.gender === "Nữ").length,
    }
  }, [students])

  const handleAssign = (student) => {
    setSelectedStudent(student)
    setIsFormOpen(true)
  }

  const handleSubmit = (student, targetClass) => {
    const targetLabel = classOptions.find((opt) => opt.value === targetClass)?.label
    toast.success(
      `Chuyển ${student.name} từ ${student.className} → ${targetLabel} thành công!`
    )
    console.log("Assign student:", student, "to class:", targetClass)
  }

  const currentClassLabel = classOptions.find((opt) => opt.value === currentClass)?.label

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Phân lớp học sinh</h1>
      </div>

      {/* Filters */}
      <ClassAssignFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentClass={currentClass}
        onCurrentClassChange={setCurrentClass}
      />

      {/* Stats */}
      <ClassAssignStats stats={stats} />

      {/* Table */}
      <ClassAssignTable students={filteredStudents} onAssign={handleAssign} />

      {/* Form Modal */}
      <ClassAssignForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        student={selectedStudent}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

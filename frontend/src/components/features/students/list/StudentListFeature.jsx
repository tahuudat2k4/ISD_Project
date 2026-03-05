import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StudentListFilters } from "./StudentListFilters"
import { StudentListStats } from "./StudentListStats"
import { StudentListTable } from "./StudentListTable"
import { StudentListForm } from "./StudentListForm"
import { StudentListDetails } from "./StudentListDetails"
import { studentService } from "@/services/studentService"
import { toast } from "sonner"

export function StudentListFeature() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Fetch students from database
  const loadStudents = async () => {
    try {
      setLoading(true)
      const res = await studentService.getStudents()
      const items = res?.data || []
      // Map database fields to frontend format
      const mapped = items.map((s) => ({
        id: s._id,
        code: s.masoHS,
        name: s.hotenHS,
        gender: s.gioitinh || "",
        dob: s.ngaysinh ? new Date(s.ngaysinh).toLocaleDateString('vi-VN') : "",
        address: s.diachi || "",
        phone: s.sdt || "",
        className: s.lopId?.tenlop || "",
        health: s.suckhoe || "",
        notes: s.ghichu || "",
        enrollmentDate: s.ngaynhaphoc || "",
        raw: s,
      }))
      setStudents(mapped)
    } catch (error) {
      console.error("Error fetching students:", error)
      toast.error("Đã xảy ra lỗi khi tải danh sách học sinh")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesGrade = selectedGrade === "all" || 
      student.className.toLowerCase().includes(selectedGrade)
    
    const matchesClass = selectedClass === "all" || 
      student.className.toLowerCase().replace(" ", "") === selectedClass

    return matchesSearch && matchesGrade && matchesClass
  })

  // Calculate stats from real data
  const stats = {
    total: students.length,
    male: students.filter(s => s.gender === "Nam").length,
    female: students.filter(s => s.gender === "Nữ").length,
    healthy: students.filter(s => s.health === "Tốt").length,
  }

  const handleAddNew = () => {
    setSelectedStudent(null)
    setIsFormOpen(true)
  }

  const handleEdit = (student) => {
    setSelectedStudent(student)
    setIsFormOpen(true)
  }

  const handleDelete = async (student) => {
    if (confirm(`Bạn có chắc muốn xóa học sinh ${student.name}?`)) {
      try {
        await studentService.deleteStudent(student.id)
        toast.success("Đã xóa học sinh thành công!")
        await loadStudents()
      } catch (error) {
        console.error("Error deleting student:", error)
        toast.error("Xóa học sinh thất bại")
      }
    }
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student)
    setIsDetailsOpen(true)
  }

  const handleSubmit = async (studentData) => {
    try {
      const payload = {
        masoHS: studentData.code,
        hotenHS: studentData.name,
        gioitinh: studentData.gender,
        ngaysinh: studentData.dob || null,
        ngaynhaphoc: studentData.enrollmentDate || null,
        diachi: studentData.address || "",
        sdt: studentData.phone || "",
        suckhoe: studentData.health || "",
        ghichu: studentData.notes || "",
        lopId: studentData.classId, // TODO: Need to get class ID from className
      }

      if (selectedStudent) {
        await studentService.updateStudent(selectedStudent.id, payload)
        toast.success("Cập nhật học sinh thành công!")
      } else {
        await studentService.createStudent(payload)
        toast.success("Thêm học sinh mới thành công!")
      }
      await loadStudents()
    } catch (error) {
      console.error("Error saving student:", error)
      toast.error(error?.response?.data?.message || "Lưu thông tin học sinh thất bại")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Danh sách học sinh</h1>
        </div>
        <Button onClick={handleAddNew} size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Thêm học sinh
        </Button>
      </div>

      {/* Filters */}
      <StudentListFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
      />

      {/* Stats */}
      <StudentListStats stats={stats} />

      {/* Table */}
      <StudentListTable
        students={filteredStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        loading={loading}
      />

      {/* Form Modal */}
      <StudentListForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        student={selectedStudent}
        onSubmit={handleSubmit}
      />

      {/* Details Modal */}
      <StudentListDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        student={selectedStudent}
      />
    </div>
  )
}

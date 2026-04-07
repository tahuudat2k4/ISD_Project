import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StudentListStats } from "./StudentListStats"
import { StudentListTable } from "./StudentListTable"
import { StudentListForm } from "./StudentListForm"
import { StudentListDetails } from "./StudentListDetails"
import { StudentDeleteDialog } from "./StudentDeleteDialog"
import { studentService } from "@/services/studentService"
import { classService } from "@/services/classService"
import { toast } from "sonner"
import { authService } from "@/services/authService"

const normalizeCode = (value) => String(value || "").trim().toLowerCase()

const toDateInputValue = (value) => {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toISOString().split("T")[0]
}

export function StudentListFeature() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [deletingStudent, setDeletingStudent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const canManageStudents = authService.isAdmin()

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
        status: s.status || "Đang học",
        gender: s.gioitinh || "",
        dob: s.ngaysinh ? new Date(s.ngaysinh).toLocaleDateString('vi-VN') : "",
        dobValue: toDateInputValue(s.ngaysinh),
        address: s.diachi || "",
        phone: s.sdt || "",
        className: s.lopId?.tenlop || "",
        classCode: s.lopId?.malop || "",
        classId: s.lopId?._id || "",
        health: s.suckhoe || "",
        notes: s.ghichu || "",
        enrollmentDate: s.ngaynhaphoc || "",
        enrollmentDateValue: toDateInputValue(s.ngaynhaphoc),
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

  // Lấy danh sách lớp thật
  const loadClasses = async () => {
    try {
      const res = await classService.getClasses();
      const items = res?.data || [];
      setClasses(items.map(c => ({
        id: c._id,
        code: c.malop,
        name: c.tenlop,
      })));
    } catch (error) {
      setClasses([]);
    }
  }

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  const normalizedSelectedClass = normalizeCode(selectedClass)

  useEffect(() => {
    if (selectedClass === "all") {
      return
    }

    const hasMatchingClass = classes.some(
      (classItem) => normalizeCode(classItem.code) === normalizedSelectedClass
    )

    if (!hasMatchingClass) {
      setSelectedClass("all")
    }
  }, [classes, normalizedSelectedClass, selectedClass])

  // Filter students by search and class
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.code.toLowerCase().includes(searchTerm.toLowerCase());

    const studentClassCode = normalizeCode(student.classCode)

    if (selectedClass !== "all") {
      return matchesSearch && studentClassCode === normalizedSelectedClass
    }

    return matchesSearch
  })

  // Calculate stats from real data
  const stats = {
    total: students.length,
    male: students.filter(s => s.gender === "Nam").length,
    female: students.filter(s => s.gender === "Nữ").length,
    healthy: students.filter(s => s.health === "Tốt").length,
  }

  const handleAddNew = () => {
    if (!canManageStudents) {
      return
    }

    setSelectedStudent(null)
    setIsFormOpen(true)
  }

  const handleEdit = (student) => {
    if (!canManageStudents) {
      return
    }

    setSelectedStudent(student)
    setIsFormOpen(true)
  }

  const handleDelete = (student) => {
    if (!canManageStudents) {
      return
    }

    setDeletingStudent(student)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingStudent) {
      return
    }

    try {
      setDeleteSubmitting(true)
      const response = await studentService.deleteStudent(deletingStudent.id)
      toast.success(response?.message || "Đã xóa học sinh thành công!")
      setIsDeleteOpen(false)
      setDeletingStudent(null)
      await loadStudents()
    } catch (error) {
      console.error("Error deleting student:", error)
      toast.error(error?.response?.data?.message || "Xóa học sinh thất bại")
    } finally {
      setDeleteSubmitting(false)
    }
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student)
    setIsDetailsOpen(true)
  }

  const handleSubmit = async (studentData) => {
    if (!canManageStudents) {
      toast.error("Chỉ quản trị viên mới có thể cập nhật hồ sơ học sinh")
      return false
    }

    try {
      const payload = {
        masoHS: studentData.code,
        hotenHS: studentData.name,
        status: studentData.status || "Đang học",
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
      return true
    } catch (error) {
      console.error("Error saving student:", error)
      toast.error(error?.response?.data?.message || "Lưu thông tin học sinh thất bại")
      return false
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Danh sách học sinh</h1>
        </div>
        {canManageStudents ? (
          <Button onClick={handleAddNew} size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            Thêm học sinh
          </Button>
        ) : null}
      </div>

      {/* Stats */}
      <StudentListStats stats={stats} />

      {/* Table */}
      <StudentListTable
        students={filteredStudents}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        classOptions={classes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        loading={loading}
        canManageStudents={canManageStudents}
      />

      {/* Form Modal */}
      {canManageStudents ? (
        <StudentListForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          student={selectedStudent}
          onSubmit={handleSubmit}
          existingStudents={students}
        />
      ) : null}

      {/* Details Modal */}
      <StudentListDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        student={selectedStudent}
      />

      <StudentDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        student={deletingStudent}
        onConfirm={handleConfirmDelete}
        submitting={deleteSubmitting}
      />
    </div>
  )
}

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
  const [filterClasses, setFilterClasses] = useState([])
  const [manageableClasses, setManageableClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [deletingStudent, setDeletingStudent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)
  const canCreateStudents = authService.isAdmin()
  const canEditStudents = authService.hasRole(["ADMIN", "TEACHER"])

  // Fetch students from database
  const loadStudents = async () => {
    try {
      setLoading(true)
      const [studentResponse, classResponse] = await Promise.all([
        studentService.getStudents(),
        classService.getClasses(),
      ])
      const items = studentResponse?.data || []
      const accessibleClasses = studentResponse?.meta?.accessibleClasses || []
      const manageableClassIdSet = new Set(accessibleClasses.map((classItem) => String(classItem.id || classItem._id)))
      const manageableClassCodeSet = new Set(accessibleClasses.map((classItem) => normalizeCode(classItem.code)))
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
        canManage: canCreateStudents || manageableClassIdSet.has(String(s.lopId?._id || "")),
        raw: s,
      }))

      const allCreatedClasses = (classResponse?.data || [])
        .map((classItem) => ({
          id: classItem._id,
          code: classItem.malop,
          name: classItem.tenlop,
          isManageable: manageableClassCodeSet.has(normalizeCode(classItem.malop)),
        }))
        .sort((firstClass, secondClass) => firstClass.code.localeCompare(secondClass.code, undefined, { numeric: true, sensitivity: "base" }))

      setStudents(mapped)
      setFilterClasses(allCreatedClasses)
      setManageableClasses(accessibleClasses)

      setSelectedClass((currentSelectedClass) => {
        if (currentSelectedClass === "all") {
          return currentSelectedClass
        }

        return allCreatedClasses.some((classItem) => normalizeCode(classItem.code) === normalizeCode(currentSelectedClass))
          ? currentSelectedClass
          : "all"
      })
    } catch (error) {
      console.error("Error fetching students:", error)
      toast.error("Đã xảy ra lỗi khi tải danh sách học sinh")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const normalizedSelectedClass = normalizeCode(selectedClass)

  useEffect(() => {
    if (selectedClass === "all") {
      return
    }

    const hasMatchingClass = filterClasses.some(
      (classItem) => normalizeCode(classItem.code) === normalizedSelectedClass
    )

    if (!hasMatchingClass) {
      setSelectedClass("all")
    }
  }, [filterClasses, normalizedSelectedClass, selectedClass])

  // Filter students by search and class
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.code.toLowerCase().includes(searchTerm.toLowerCase())

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
    averagePerClass: filterClasses.length ? students.length / filterClasses.length : 0,
  }

  const pageTitle = "Danh sách học sinh"
  const pageDescription = "Theo dõi toàn bộ học sinh trong hệ thống."

  const handleAddNew = () => {
    if (!canCreateStudents) {
      return
    }

    setSelectedStudent(null)
    setIsFormOpen(true)
  }

  const handleEdit = (student) => {
    if (!student?.canManage) {
      return
    }

    setSelectedStudent(student)
    setIsFormOpen(true)
  }

  const handleDelete = (student) => {
    if (!student?.canManage) {
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
    if (!student?.canManage) {
      return
    }

    setSelectedStudent(student)
    setIsDetailsOpen(true)
  }

  const handleSubmit = async (studentData) => {
    if (!canEditStudents) {
      toast.error("Bạn không có quyền cập nhật hồ sơ học sinh")
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
          <h1 className="text-xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{pageDescription}</p>
        </div>
        {canCreateStudents ? (
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
        classOptions={filterClasses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        loading={loading}
        canManageStudents={canEditStudents}
      />

      {/* Form Modal */}
      {canEditStudents ? (
        <StudentListForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          student={selectedStudent}
          onSubmit={handleSubmit}
          existingStudents={students}
          classOptions={manageableClasses}
          disableClassSelection={!canCreateStudents}
          allowCreateStudent={canCreateStudents}
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

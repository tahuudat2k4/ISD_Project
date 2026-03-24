import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StudentListFilters } from "./StudentListFilters"
import { StudentListStats } from "./StudentListStats"
import { StudentListTable } from "./StudentListTable"
import { StudentListForm } from "./StudentListForm"
import { StudentListDetails } from "./StudentListDetails"
import { studentService } from "@/services/studentService"
import { classService } from "@/services/classService"
import { toast } from "sonner"
import { authService } from "@/services/authService"

export function StudentListFeature() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const canManageStudents = authService.isAdmin()

  // Fetch students from database
  const loadStudents = async () => {
    try {
      setLoading(true)
      const res = await studentService.getStudents()
      const items = res?.data || []
      // Map database fields to frontend format, lấy thêm mã lớp và mã khối
      const mapped = items.map((s) => ({
        id: s._id,
        code: s.masoHS,
        name: s.hotenHS,
        gender: s.gioitinh || "",
        dob: s.ngaysinh ? new Date(s.ngaysinh).toLocaleDateString('vi-VN') : "",
        address: s.diachi || "",
        phone: s.sdt || "",
        className: s.lopId?.tenlop || "",
        classCode: s.lopId?.malop || "",
        gradeCode: s.lopId?.khoiId?.makhoi || "",
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

  // Lấy danh sách lớp thật
  const loadClasses = async () => {
    try {
      const res = await classService.getClasses();
      const items = res?.data || [];
      setClasses(items.map(c => ({
        id: c._id,
        code: c.malop,
        name: c.tenlop,
        gradeCode: c.khoiId?.makhoi || ""
      })));
    } catch (error) {
      setClasses([]);
    }
  }

  useEffect(() => {
    loadStudents();
    loadClasses();
  }, []);

  // Lọc danh sách lớp theo khối đã chọn
  const filteredClassOptions = selectedGrade === "all"
    ? classes
    : classes.filter(cls => (cls.gradeCode || "").toLowerCase() === selectedGrade);

  // Filter students: lọc đúng ý định người dùng
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.code.toLowerCase().includes(searchTerm.toLowerCase());

    // Nếu chỉ chọn khối
    if (selectedGrade !== "all" && selectedClass === "all") {
      return matchesSearch && student.gradeCode && student.gradeCode.toLowerCase() === selectedGrade;
    }
    // Nếu chỉ chọn lớp
    if (selectedGrade === "all" && selectedClass !== "all") {
      return matchesSearch && student.classCode && student.classCode.toLowerCase() === selectedClass;
    }
    // Nếu chọn cả hai
    if (selectedGrade !== "all" && selectedClass !== "all") {
      return (
        matchesSearch &&
        student.gradeCode && student.gradeCode.toLowerCase() === selectedGrade &&
        student.classCode && student.classCode.toLowerCase() === selectedClass
      );
    }
    // Nếu không chọn gì
    return matchesSearch;
  });

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

  const handleDelete = async (student) => {
    if (!canManageStudents) {
      return
    }

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
    if (!canManageStudents) {
      toast.error("Chỉ quản trị viên mới có thể cập nhật hồ sơ học sinh")
      return
    }

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
        {canManageStudents ? (
          <Button onClick={handleAddNew} size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            Thêm học sinh
          </Button>
        ) : null}
      </div>

      {/* Filters */}
      <StudentListFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedGrade={selectedGrade}
        onGradeChange={setSelectedGrade}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        classOptions={filteredClassOptions}
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
        canManageStudents={canManageStudents}
      />

      {/* Form Modal */}
      {canManageStudents ? (
        <StudentListForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          student={selectedStudent}
          onSubmit={handleSubmit}
        />
      ) : null}

      {/* Details Modal */}
      <StudentListDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        student={selectedStudent}
      />
    </div>
  )
}

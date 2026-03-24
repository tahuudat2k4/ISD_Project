import { useCallback, useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeafClassFilters } from "./LeafClassFilters"
import { LeafClassStats } from "./LeafClassStats"
import { LeafClassTable } from "./LeafClassTable"
import { LeafClassDetails } from "./LeafClassDetails"
import { ClassCreateDialog } from "../ClassCreateDialog"
import { toast } from "sonner"
import { authService } from "@/services/authService"
import { classService } from "@/services/classService"
import { gradeService } from "@/services/gradeService"
import { studentService } from "@/services/studentService"
import { buildClassViewModels, findGradeByKeyword } from "../classViewModel"
import { teacherService } from "@/services/teacherService"

export function LeafClassFeature() {
  const gradeCode = "LA"
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [grades, setGrades] = useState([])
  const [createOpen, setCreateOpen] = useState(false)
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedClass, setSelectedClass] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const isAdmin = authService.isAdmin()
  const targetGrade = useMemo(() => findGradeByKeyword(grades, "lá"), [grades])

  const loadClasses = useCallback(async () => {
    try {
      const [classResponse, studentResponse] = await Promise.all([
        classService.getClasses(),
        studentService.getStudents(),
      ])

      setClasses(buildClassViewModels(classResponse?.data || [], studentResponse?.data || [], "lá"))
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Không thể tải danh sách lớp lá"
      toast.error(message)
    }
  }, [])

  useEffect(() => {
    loadClasses()
  }, [loadClasses])

  useEffect(() => {
    if (!isAdmin) {
      return
    }

    Promise.all([teacherService.getTeachers(), gradeService.getGrades()])
      .then(([teacherResponse, gradeResponse]) => {
        setTeachers(teacherResponse?.data || [])
        setGrades(gradeResponse?.data || [])
      })
      .catch((error) => {
        const message = error?.response?.data?.message || error?.message || "Không thể tải dữ liệu thêm lớp"
        toast.error(message)
      })
  }, [isAdmin])

  const filteredClasses = useMemo(() => {
    return classes.filter((leafClass) => {
      const matchesSearch =
        leafClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leafClass.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        selectedStatus === "all" || leafClass.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [classes, searchTerm, selectedStatus])

  const stats = useMemo(() => {
    return {
      total: filteredClasses.length,
      totalStudents: filteredClasses.reduce(
        (sum, c) => sum + c.currentStudents,
        0
      ),
      averagePerClass:
        filteredClasses.length > 0
          ? filteredClasses.reduce((sum, c) => sum + c.currentStudents, 0) /
            filteredClasses.length
          : 0,
    }
  }, [filteredClasses])

  const handleEdit = (leafClass) => {
    if (!isAdmin) {
      return
    }

    toast.info("Chức năng chỉnh sửa sắp ra mắt")
    console.log("Edit class:", leafClass)
  }

  const handleDelete = (leafClass) => {
    if (!isAdmin) {
      return
    }

    if (!confirm(`Bạn có chắc muốn xóa lớp ${leafClass.name}?`)) {
      return
    }

    classService.deleteClass(leafClass.id)
      .then((response) => {
        toast.success(response?.message || "Đã xóa lớp học thành công!")
        loadClasses()
      })
      .catch((error) => {
        const message = error?.response?.data?.message || error?.message || "Xóa lớp học thất bại"
        toast.error(message)
      })
  }

  const handleViewDetails = (leafClass) => {
    setSelectedClass(leafClass)
    setIsDetailsOpen(true)
  }

  const handleCreateClass = async (payload) => {
    if (!payload.malop || !payload.tenlop || !payload.giaoVienId) {
      toast.error("Vui lòng nhập đầy đủ mã lớp, tên lớp và giáo viên chủ nhiệm")
      return
    }

    try {
      setCreateSubmitting(true)
      const response = await classService.createClass({
        ...payload,
        ...(targetGrade?._id ? { khoiId: targetGrade._id } : { makhoi: gradeCode }),
      })
      toast.success(response?.message || "Tạo lớp học thành công")
      setCreateOpen(false)
      await loadClasses()
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Không thể tạo lớp học"
      toast.error(message)
    } finally {
      setCreateSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Quản lý lớp Lá</h1>
        </div>
        {isAdmin ? (
          <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)} disabled={createSubmitting}>
            <Plus className="size-3.5" />
            Thêm lớp
          </Button>
        ) : null}
      </div>

      <LeafClassFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <LeafClassStats stats={stats} />

      <LeafClassTable
        classes={filteredClasses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
        canManageClasses={isAdmin}
      />

      <LeafClassDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        leafClass={selectedClass}
      />

      <ClassCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateClass}
        gradeLabel={targetGrade?.tenkhoi || "Lá"}
        teachers={teachers}
        submitting={createSubmitting}
      />
    </div>
  )
}

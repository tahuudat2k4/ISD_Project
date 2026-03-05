import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GermClassFilters } from "./GermClassFilters"
import { GermClassStats } from "./GermClassStats"
import { GermClassTable } from "./GermClassTable"
import { GermClassDetails } from "./GermClassDetails"
import { mockGermClasses } from "./germClassesData"
import { toast } from "sonner"

export function GermClassFeature() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedClass, setSelectedClass] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter classes based on search and filters
  const filteredClasses = useMemo(() => {
    return mockGermClasses.filter((germClass) => {
      const matchesSearch =
        germClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        germClass.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        selectedStatus === "all" || germClass.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, selectedStatus])

  // Calculate stats
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

  const handleEdit = (germClass) => {
    toast.info("Chức năng chỉnh sửa sắp ra mắt")
    console.log("Edit class:", germClass)
  }

  const handleDelete = (germClass) => {
    if (confirm(`Bạn có chắc muốn xóa lớp ${germClass.name}?`)) {
      toast.success("Đã xóa lớp học thành công!")
      console.log("Delete class:", germClass)
    }
  }

  const handleViewDetails = (germClass) => {
    setSelectedClass(germClass)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Quản lý lớp Mầm</h1>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Thêm lớp
        </Button>
      </div>

      {/* Filters */}
      <GermClassFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Stats */}
      <GermClassStats stats={stats} />

      {/* Table */}
      <GermClassTable
        classes={filteredClasses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />

      {/* Details Modal */}
      <GermClassDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        germClass={selectedClass}
      />
    </div>
  )
}

import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeafClassFilters } from "./LeafClassFilters"
import { LeafClassStats } from "./LeafClassStats"
import { LeafClassTable } from "./LeafClassTable"
import { LeafClassDetails } from "./LeafClassDetails"
import { mockLeafClasses } from "./leafClassesData"
import { toast } from "sonner"

export function LeafClassFeature() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedClass, setSelectedClass] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredClasses = useMemo(() => {
    return mockLeafClasses.filter((leafClass) => {
      const matchesSearch =
        leafClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leafClass.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        selectedStatus === "all" || leafClass.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [searchTerm, selectedStatus])

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
    toast.info("Chức năng chỉnh sửa sắp ra mắt")
    console.log("Edit class:", leafClass)
  }

  const handleDelete = (leafClass) => {
    if (confirm(`Bạn có chắc muốn xóa lớp ${leafClass.name}?`)) {
      toast.success("Đã xóa lớp học thành công!")
      console.log("Delete class:", leafClass)
    }
  }

  const handleViewDetails = (leafClass) => {
    setSelectedClass(leafClass)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Quản lý lớp Lá</h1>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Thêm lớp
        </Button>
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
      />

      <LeafClassDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        leafClass={selectedClass}
      />
    </div>
  )
}

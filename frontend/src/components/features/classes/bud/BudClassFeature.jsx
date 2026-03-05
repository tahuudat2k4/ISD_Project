import { useState, useMemo } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BudClassFilters } from "./BudClassFilters"
import { BudClassStats } from "./BudClassStats"
import { BudClassTable } from "./BudClassTable"
import { BudClassDetails } from "./BudClassDetails"
import { mockBudClasses } from "./budClassesData"
import { toast } from "sonner"

export function BudClassFeature() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedClass, setSelectedClass] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredClasses = useMemo(() => {
    return mockBudClasses.filter((budClass) => {
      const matchesSearch =
        budClass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budClass.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        selectedStatus === "all" || budClass.status === selectedStatus

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

  const handleEdit = (budClass) => {
    toast.info("Chức năng chỉnh sửa sắp ra mắt")
    console.log("Edit class:", budClass)
  }

  const handleDelete = (budClass) => {
    if (confirm(`Bạn có chắc muốn xóa lớp ${budClass.name}?`)) {
      toast.success("Đã xóa lớp học thành công!")
      console.log("Delete class:", budClass)
    }
  }

  const handleViewDetails = (budClass) => {
    setSelectedClass(budClass)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Quản lý lớp Chồi</h1>
        </div>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Thêm lớp
        </Button>
      </div>

      <BudClassFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      <BudClassStats stats={stats} />

      <BudClassTable
        classes={filteredClasses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />

      <BudClassDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        budClass={selectedClass}
      />
    </div>
  )
}

"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TeacherDetail } from "./TeacherDetail"
import { EditTeacherForm } from "./EditTeacherForm"
import { AddTeacherForm } from "./AddTeacherForm"
import { teacherService } from "@/services/teacherService"
import { authService } from "@/services/authService"

export function TeacherList() {
  const [rows, setRows] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [addOpen, setAddOpen] = React.useState(false)
  const isAdmin = authService.isAdmin()

  const loadTeachers = React.useCallback(async () => {
    try {
      setLoading(true)
      setError("")
      const res = await teacherService.getTeachers()
      // API returns { success, data }
      const items = res?.data || []
      const mapped = items.map((t) => ({
        id: t._id,
        masoGV: t.masoGV,
        name: t.hotenGV || t.name || "",
        email: t.email || "",
        phone: t.sdt || "",
        address: t.diachi || "",
        gioitinh: t.gioitinh || "",
        dateOfBirth: t.ngaysinh || "",
        joinDate: t.ngayvaolam || "",
        degree: t.trinhdohocvan || "",
        experience: t.kinhnghiem || "",
        subject: t.subject || "",
        class: t.class || "",
        status: t.status || "active",
        avatar: "/avatars/placeholder-teacher.jpg",
        raw: t,
      }))
      setRows(mapped)
    } catch (e) {
      setError(e?.message || "Không thể tải danh sách giáo viên")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadTeachers()
  }, [loadTeachers])

  const columns = React.useMemo(() => [
    {
      accessorKey: "masoGV",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="w-full"
          >
            Mã Số GV
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-mono font-medium text-center pr-5">{row.getValue("masoGV")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Họ và Tên
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const teacher = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={teacher.avatar} alt={teacher.name} />
              <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{teacher.name}</div>
              <div className="text-sm text-muted-foreground">{teacher.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-center">Số Điện Thoại</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "subject",
      header: () => <div className="text-center">Môn Giảng Dạy</div>,
      cell: ({ row }) => <div className="font-medium text-center">{row.getValue("subject")}</div>,
    },
    {
      accessorKey: "class",
      header: () => <div className="text-center">Lớp Chủ Nhiệm</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline">{row.getValue("class")}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Trạng Thái</div>,
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <div className="flex justify-center">
            {status === "active" ? (
              <Badge className="bg-green-600 hover:bg-green-700 text-white">Đang làm việc</Badge>
            ) : (
              <Badge variant="secondary">Nghỉ phép</Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const teacher = row.original
        const [detailOpen, setDetailOpen] = React.useState(false)
        const [editOpen, setEditOpen] = React.useState(false)

        const handleSave = async (updatedTeacher) => {
          try {
            const payload = {
              masoGV: updatedTeacher.masoGV,
              hotenGV: updatedTeacher.name,
              gioitinh: updatedTeacher.gioitinh,
              ngaysinh: updatedTeacher.dateOfBirth || null,
              diachi: updatedTeacher.address || "",
              email: updatedTeacher.email,
              sdt: updatedTeacher.phone,
              ngayvaolam: updatedTeacher.joinDate || null,
              trinhdohocvan: updatedTeacher.degree || "",
              kinhnghiem: updatedTeacher.experience || "",
              subject: updatedTeacher.subject || "",
              class: updatedTeacher.class || "",
              status: updatedTeacher.status || "active"
            }
            const res = await teacherService.updateTeacher(teacher.id, payload)
            if (res?.success) {
              // Đợi backend cập nhật xong rồi reload danh sách
              await loadTeachers()
            } else {
              throw new Error(res?.message || "Cập nhật giáo viên thất bại")
            }
          } catch (e) {
            console.error("Update teacher failed:", e)
            const msg = e?.response?.data?.message || e?.message || "Cập nhật giáo viên thất bại"
            alert(msg)
          }
        }

        const handleDelete = async () => {
          try {
            if (!confirm("Bạn có chắc muốn xóa giáo viên này?")) return
            const res = await teacherService.deleteTeacher(teacher.id)
            if (res?.success) {
              await loadTeachers()
            } else {
              throw new Error(res?.message || "Xóa giáo viên thất bại")
            }
          } catch (e) {
            console.error("Delete teacher failed:", e)
            alert(e?.message || "Xóa giáo viên thất bại")
          }
        }

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Mở menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(teacher.email)}>
                  Sao chép email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDetailOpen(true)}>
                  Xem chi tiết
                </DropdownMenuItem>
                {isAdmin ? (
                  <>
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>Xóa</DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
            <TeacherDetail 
              teacher={teacher} 
              open={detailOpen} 
              onOpenChange={setDetailOpen}
            />
            {isAdmin ? (
              <EditTeacherForm
                teacher={teacher}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSave={handleSave}
              />
            ) : null}
          </>
        )
      },
    },
  ], [isAdmin, loadTeachers])

  const handleAddTeacher = async (form) => {
    if (!isAdmin) {
      alert("Chỉ quản trị viên mới có thể thêm giáo viên")
      return
    }

    try {
      // Map form fields to backend schema
      const payload = {
        masoGV: form.masoGV,
        hotenGV: form.name,
        gioitinh: form.gioitinh,
        ngaysinh: form.dateOfBirth || null,
        diachi: form.address || "",
        email: form.email,
        sdt: form.phone,
        ngayvaolam: form.joinDate || null,
        trinhdohocvan: form.degree || "",
        kinhnghiem: form.experience || "",
        subject: form.subject || "",
        class: form.class || "",
      }
      const res = await teacherService.createTeacher(payload)
      if (res?.success) {
        await loadTeachers()
      } else {
        throw new Error(res?.message || "Thêm giáo viên thất bại")
      }
    } catch (e) {
      console.error("Add teacher failed:", e)
      const msg = e?.response?.data?.message || e?.message || "Thêm giáo viên thất bại"
      alert(msg)
    }
  }

  const table = useReactTable({
    data: rows,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm giáo viên..."
            value={(table.getColumn("name")?.getFilterValue()) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-8 max-w-sm"
          />
        </div>
        {isAdmin ? <Button onClick={() => setAddOpen(true)}>Thêm Giáo Viên</Button> : null}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? "Đang tải..." : error || "Không có kết quả."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        </div>
      </div>
      {isAdmin ? (
        <AddTeacherForm
          open={addOpen}
          onOpenChange={setAddOpen}
          onSave={handleAddTeacher}
        />
      ) : null}
    </div>
  )
}

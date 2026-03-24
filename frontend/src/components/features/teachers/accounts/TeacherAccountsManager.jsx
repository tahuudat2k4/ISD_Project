import * as React from "react"
import { toast } from "sonner"
import { Eye, EyeOff, KeyRound, LoaderCircle, RotateCcw, Search, ShieldCheck, Trash2, UserRoundPlus } from "lucide-react"

import { teacherService } from "@/services/teacherService"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const initialFormState = {
  username: "",
  password: "",
  confirmPassword: "",
}

const initialPasswordVisibility = {
  password: false,
  confirmPassword: false,
}


export function TeacherAccountsManager() {
  const [teachers, setTeachers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState("create")
  const [selectedTeacher, setSelectedTeacher] = React.useState(null)
  const [form, setForm] = React.useState(initialFormState)
  const [showPassword, setShowPassword] = React.useState(initialPasswordVisibility)
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const limit = 10

  const loadTeachers = React.useCallback(async (pageNum = 1, search = "") => {
    try {
      setLoading(true)
      const response = await teacherService.getTeacherAccountManagement({ page: pageNum, limit, query: search })
      setTeachers(response?.data || [])
      setTotalPages(response?.pagination?.totalPages || 1)
      setTotal(response?.pagination?.total || 0)
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Không thể tải danh sách tài khoản giáo viên"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadTeachers(page, query)
  }, [loadTeachers, page, query])

  // Xử lý tìm kiếm: reset về trang 1 khi thay đổi query
  React.useEffect(() => {
    setPage(1)
  }, [query])

  // Không cần filteredTeachers vì backend đã phân trang và lọc
  const filteredTeachers = teachers

  const openDialog = (teacher, mode) => {
    setSelectedTeacher(teacher)
    setDialogMode(mode)
    setForm({
      username: teacher.account?.username || teacher.masoGV?.toLowerCase() || "",
      password: "",
      confirmPassword: "",
    })
    setShowPassword(initialPasswordVisibility)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setDialogMode("create")
    setSelectedTeacher(null)
    setForm(initialFormState)
    setShowPassword(initialPasswordVisibility)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const username = form.username.trim()
    const password = form.password.trim()

    if (!selectedTeacher) {
      return
    }

    if (!username || !password) {
      toast.error("Tên đăng nhập và mật khẩu là bắt buộc")
      return
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự")
      return
    }

    if (password !== form.confirmPassword.trim()) {
      toast.error("Mật khẩu xác nhận không khớp")
      return
    }

    try {
      setSubmitting(true)
      const response = dialogMode === "create"
        ? await teacherService.createTeacherAccount(selectedTeacher.teacherId, {
            username,
            password,
          })
        : await teacherService.resetTeacherAccountPassword(selectedTeacher.teacherId, {
            password,
          })

      toast.success(
        response?.message || (dialogMode === "create" ? "Đã tạo tài khoản giáo viên" : "Đã đặt lại mật khẩu")
      )
      closeDialog()
      await loadTeachers()
    } catch (error) {
      const message = error?.response?.data?.message
        || error?.message
        || (dialogMode === "create" ? "Tạo tài khoản giáo viên thất bại" : "Đặt lại mật khẩu thất bại")
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAccount = async (teacher) => {
    const confirmed = globalThis.confirm(`Xóa tài khoản của ${teacher.hotenGV} (${teacher.masoGV})?`)

    if (!confirmed) {
      return
    }

    try {
      setSubmitting(true)
      const response = await teacherService.deleteTeacherAccount(teacher.teacherId)
      toast.success(response?.message || "Đã xóa tài khoản giáo viên")
      await loadTeachers()
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Xóa tài khoản giáo viên thất bại"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const isCreateMode = dialogMode === "create"

  return (
    <>
      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Quản lý tài khoản giáo viên
            </CardTitle>
            <CardDescription>
              Admin có thể tạo, đặt lại mật khẩu và xóa tài khoản đăng nhập của giáo viên.
            </CardDescription>
            <p className="text-xs text-muted-foreground">
              Mật khẩu hiện tại không thể xem lại vì hệ thống chỉ lưu ở dạng mã hóa. Khi cần, hãy đặt lại mật khẩu mới và dùng nút hiện/ẩn để kiểm tra trước khi lưu.
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo mã, tên, email hoặc username"
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giáo viên</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Trạng thái làm việc</TableHead>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        Đang tải dữ liệu...
                      </span>
                    </TableCell>
                  </TableRow>
                ) : filteredTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Không có giáo viên phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.teacherId}>
                      <TableCell className="font-medium">{teacher.masoGV}</TableCell>
                      <TableCell>
                        <div className="font-medium">{teacher.hotenGV}</div>
                        <div className="text-xs text-muted-foreground">{teacher.subject || "Chưa cập nhật bộ môn"}</div>
                      </TableCell>
                      <TableCell>{teacher.email || "Chưa có email"}</TableCell>
                      <TableCell>
                        {teacher.status === "Đang làm việc" ? (
                          <Badge className="bg-green-600 hover:bg-green-700">Đang làm việc</Badge>
                        ) : (
                          <Badge variant="secondary">{teacher.status || "Chưa rõ"}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{teacher.account?.username || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {teacher.hasAccount ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDialog(teacher, "reset")}
                                disabled={submitting}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Đặt lại mật khẩu
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteAccount(teacher)}
                                disabled={submitting}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa tài khoản
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => openDialog(teacher, "create")}
                              disabled={submitting}>
                              <UserRoundPlus className="mr-2 h-4 w-4" />
                              Tạo tài khoản
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* PHÂN TRANG */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Trang {page} / {totalPages} (Tổng: {total} giáo viên)
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>
                Trước
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>
                Sau
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          closeDialog()
          return
        }

        setDialogOpen(open)
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-600" />
              {isCreateMode ? "Tạo tài khoản cho giáo viên" : "Đặt lại mật khẩu giáo viên"}
            </DialogTitle>
            <DialogDescription>
              {selectedTeacher
                ? `${isCreateMode ? "Thiết lập" : "Cập nhật"} tài khoản đăng nhập cho ${selectedTeacher.hotenGV} (${selectedTeacher.masoGV}).`
                : "Thiết lập tài khoản đăng nhập cho giáo viên."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                placeholder="Ví dụ: gv001"
                autoComplete="username"
                disabled={!isCreateMode || submitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword.password ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Tối thiểu 6 ký tự"
                  autoComplete="new-password"
                  disabled={submitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword.password ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>
                  {showPassword.password ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  disabled={submitting}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword.confirmPassword ? "Ẩn xác nhận mật khẩu" : "Hiện xác nhận mật khẩu"}>
                  {showPassword.confirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={submitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {isCreateMode ? "Đang tạo..." : "Đang cập nhật..."}
                  </>
                ) : (
                  isCreateMode ? "Tạo tài khoản" : "Lưu mật khẩu mới"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
import * as React from "react"
import { toast } from "sonner"
import { KeyRound, LoaderCircle, Search, ShieldCheck, UserRoundPlus } from "lucide-react"

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

export function TeacherAccountsManager() {
  const [teachers, setTeachers] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedTeacher, setSelectedTeacher] = React.useState(null)
  const [form, setForm] = React.useState(initialFormState)

  const loadTeachers = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await teacherService.getTeacherAccountManagement()
      setTeachers(response?.data || [])
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Không thể tải danh sách tài khoản giáo viên"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadTeachers()
  }, [loadTeachers])

  const filteredTeachers = React.useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) {
      return teachers
    }

    return teachers.filter((teacher) => {
      return [teacher.masoGV, teacher.hotenGV, teacher.email, teacher.account?.username]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword))
    })
  }, [teachers, query])

  const openCreateDialog = (teacher) => {
    setSelectedTeacher(teacher)
    setForm({
      username: teacher.masoGV?.toLowerCase() || "",
      password: "",
      confirmPassword: "",
    })
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setSelectedTeacher(null)
    setForm(initialFormState)
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
      const response = await teacherService.createTeacherAccount(selectedTeacher.teacherId, {
        username,
        password,
      })

      toast.success(response?.message || "Đã tạo tài khoản giáo viên")
      closeDialog()
      await loadTeachers()
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Tạo tài khoản giáo viên thất bại"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

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
              Tạo thông tin đăng nhập cho các giáo viên chưa có tài khoản trong hệ thống.
            </CardDescription>
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
                  <TableHead>Trạng thái tài khoản</TableHead>
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
                        {teacher.hasAccount ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">Đã có tài khoản</Badge>
                        ) : (
                          <Badge variant="secondary">Chưa tạo</Badge>
                        )}
                      </TableCell>
                      <TableCell>{teacher.account?.username || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => openCreateDialog(teacher)}
                          disabled={teacher.hasAccount}>
                          <UserRoundPlus className="mr-2 h-4 w-4" />
                          Tạo tài khoản
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
              Tạo tài khoản cho giáo viên
            </DialogTitle>
            <DialogDescription>
              {selectedTeacher
                ? `Thiết lập tài khoản đăng nhập cho ${selectedTeacher.hotenGV} (${selectedTeacher.masoGV}).`
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
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Tối thiểu 6 ký tự"
                autoComplete="new-password"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={submitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo tài khoản"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
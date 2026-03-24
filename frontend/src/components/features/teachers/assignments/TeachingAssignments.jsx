import {
  CalendarDays,
  Filter,
  Plus,
  School,
  Sparkles,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authService } from "@/services/authService"

const assignments = [
  {
    id: "A-01",
    className: "Mầm 1",
    grade: "Khối Mầm",
    room: "P.M1",
    students: 28,
    mainTeacher: "Nguyễn Thị Lan",
    assistantTeacher: "Trần Minh",
    schedule: "T2–T6 · 7:30–16:30",
    status: "Đã phân công",
    updatedAt: "02/02/2026",
  },
  {
    id: "A-02",
    className: "Chồi 2",
    grade: "Khối Chồi",
    room: "P.C2",
    students: 30,
    mainTeacher: "Phạm Thị Thu",
    assistantTeacher: "Lê Quốc Huy",
    schedule: "T2–T6 · 7:30–16:30",
    status: "Đã phân công",
    updatedAt: "01/02/2026",
  },
  {
    id: "A-03",
    className: "Lá 1",
    grade: "Khối Lá",
    room: "P.L1",
    students: 32,
    mainTeacher: "Võ Minh Anh",
    assistantTeacher: "",
    schedule: "T2–T6 · 7:30–16:30",
    status: "Chưa phân công",
    updatedAt: "01/02/2026",
  },
  {
    id: "A-04",
    className: "Mầm 3",
    grade: "Khối Mầm",
    room: "P.M3",
    students: 26,
    mainTeacher: "Đặng Thu Trang",
    assistantTeacher: "",
    schedule: "T2–T6 · 7:30–16:30",
    status: "Tạm thời",
    updatedAt: "31/01/2026",
  },
  {
    id: "A-05",
    className: "Chồi 1",
    grade: "Khối Chồi",
    room: "P.C1",
    students: 29,
    mainTeacher: "Ngô Nhật Nam",
    assistantTeacher: "Phan Hoài An",
    schedule: "T2–T6 · 7:30–16:30",
    status: "Đã phân công",
    updatedAt: "30/01/2026",
  },
]

const teacherWorkload = [
  {
    name: "Nguyễn Thị Lan",
    role: "Giáo viên chủ nhiệm",
    classes: 2,
    load: 80,
  },
  {
    name: "Phạm Thị Thu",
    role: "Giáo viên chủ nhiệm",
    classes: 1,
    load: 60,
  },
  {
    name: "Võ Minh Anh",
    role: "Giáo viên",
    classes: 1,
    load: 45,
  },
  {
    name: "Lê Quốc Huy",
    role: "Trợ giảng",
    classes: 2,
    load: 70,
  },
]

const unassignedClasses = assignments.filter(
  (assignment) => assignment.status !== "Đã phân công"
)

const stats = [
  {
    title: "Tổng lớp",
    value: assignments.length,
    icon: School,
    note: "Đang theo dõi",
  },
  {
    title: "Đã phân công",
    value: assignments.filter((item) => item.status === "Đã phân công").length,
    icon: Users,
    note: "Ổn định",
  },
  {
    title: "Chờ xử lý",
    value: unassignedClasses.length,
    icon: CalendarDays,
    note: "Ưu tiên cao",
  },
]

function getInitials(name) {
  if (!name) return "?"
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(-2)
    .join("")
    .toUpperCase()
}

function renderStatus(status) {
  if (status === "Đã phân công") {
    return <Badge variant="secondary">Đã phân công</Badge>
  }

  if (status === "Tạm thời") {
    return <Badge variant="outline">Tạm thời</Badge>
  }

  return <Badge variant="destructive">Chưa phân công</Badge>
}

export function TeachingAssignments() {
  const isAdmin = authService.isAdmin()

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="size-3.5" />
            Kỳ học II · 2025–2026
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Phân công giảng dạy
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="size-3.5" />
            <span className="hidden sm:inline">Lọc</span>
          </Button>
          {isAdmin ? (
            <Button size="sm" className="gap-1.5">
              <Plus className="size-3.5" />
              <span className="hidden sm:inline">Tạo mới</span>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <div className="text-xl font-semibold text-foreground">
                  {item.value}
                </div>
              </div>
              <div className="rounded-full border border-dashed p-1.5 text-muted-foreground">
                <item.icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-[11px] text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Điều kiện lọc</CardTitle>
          <CardDescription className="text-xs">
            Tìm nhanh theo lớp, khối, trạng thái.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Input placeholder="Tìm lớp" className="h-8 text-sm" />
          <Select>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Chọn khối" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mam">Khối Mầm</SelectItem>
              <SelectItem value="choi">Khối Chồi</SelectItem>
              <SelectItem value="la">Khối Lá</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assigned">Đã phân công</SelectItem>
              <SelectItem value="pending">Chưa phân công</SelectItem>
              <SelectItem value="temporary">Tạm thời</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger size="sm">
              <SelectValue placeholder="Buổi học" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sang">Buổi sáng</SelectItem>
              <SelectItem value="chieu">Buổi chiều</SelectItem>
              <SelectItem value="full">Cả ngày</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Danh sách phân công</CardTitle>
            <CardDescription className="text-xs">
              Tổng hợp lớp, giáo viên và lịch dạy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="gap-4">
              <TabsList>
                <TabsTrigger value="list">Danh sách</TabsTrigger>
                <TabsTrigger value="teacher">Theo giáo viên</TabsTrigger>
                <TabsTrigger value="class">Theo lớp</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Lớp</TableHead>
                        <TableHead className="w-[150px]">Giáo viên</TableHead>
                        <TableHead className="hidden lg:table-cell w-[130px]">Trợ giảng</TableHead>
                        <TableHead className="hidden xl:table-cell w-[140px]">Lịch học</TableHead>
                        <TableHead className="w-[100px]">Trạng thái</TableHead>
                        <TableHead className="text-right w-[120px]">Tác vụ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div className="space-y-0.5">
                              <div className="text-sm font-medium">{assignment.className}</div>
                              <div className="text-[11px] text-muted-foreground">
                                {assignment.room} · {assignment.students}HS
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Avatar size="sm">
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(assignment.mainTeacher)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs truncate max-w-[100px]">
                                {assignment.mainTeacher || "Chưa"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center gap-1.5">
                              <Avatar size="sm">
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(assignment.assistantTeacher)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs truncate max-w-[90px]">
                                {assignment.assistantTeacher || "Chưa có"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="text-xs">{assignment.schedule}</div>
                          </TableCell>
                          <TableCell>{renderStatus(assignment.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="outline" size="xs" className="text-[11px] h-6">
                                Xem
                              </Button>
                              {isAdmin ? (
                                <Button variant="ghost" size="xs" className="text-[11px] h-6 hidden sm:inline-flex">
                                  Sửa
                                </Button>
                              ) : null}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="teacher">
                <div className="grid gap-4">
                  {teacherWorkload.map((teacher) => (
                    <div
                      key={teacher.name}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{teacher.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {teacher.role} · {teacher.classes} lớp
                          </div>
                        </div>
                        <Badge variant="outline">Tải {teacher.load}%</Badge>
                      </div>
                      <div className="mt-3 h-2 w-full rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${teacher.load}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="class">
                <div className="grid gap-4 sm:grid-cols-2">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-medium">{assignment.className}</div>
                          <div className="text-xs text-muted-foreground">
                            {assignment.grade} · {assignment.room}
                          </div>
                        </div>
                        {renderStatus(assignment.status)}
                      </div>
                      <div className="mt-3 space-y-1 text-sm">
                        <div>Giáo viên chính: {assignment.mainTeacher || "Chưa có"}</div>
                        <div>Trợ giảng: {assignment.assistantTeacher || "Chưa có"}</div>
                        <div>Lịch học: {assignment.schedule}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-3">
            <span>5/5 lớp</span>
            <span>02/02/2026</span>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lớp cần ưu tiên</CardTitle>
              <CardDescription className="text-xs">
                Chưa có giáo viên đầy đủ.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {unassignedClasses.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg border border-dashed p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">
                        {assignment.className}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {assignment.grade} · {assignment.students} học sinh
                      </div>
                    </div>
                    {renderStatus(assignment.status)}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Lịch học: {assignment.schedule}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gợi ý phân công</CardTitle>
              <CardDescription>
                Danh sách giáo viên sẵn sàng nhận lớp.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {teacherWorkload.map((teacher) => (
                <div
                  key={teacher.name}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <div className="text-sm font-medium">{teacher.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {teacher.role} · {teacher.classes} lớp
                    </div>
                  </div>
                  {isAdmin ? <Button size="sm" variant="outline">Đề xuất</Button> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

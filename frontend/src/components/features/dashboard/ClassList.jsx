import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function ClassList() {
  const classes = [
    {
      id: 1,
      name: "Mầm 1A",
      students: 20,
      teacher: "Nguyễn Thị Lan",
      status: "active",
      present: 19,
    },
    {
      id: 2,
      name: "Mầm 1B",
      students: 22,
      teacher: "Trần Văn Nam",
      status: "active",
      present: 21,
    },
    {
      id: 3,
      name: "Mầm 2A",
      students: 21,
      teacher: "Lê Thị Hoa",
      status: "active",
      present: 20,
    },
    {
      id: 4,
      name: "Mầm 2B",
      students: 19,
      teacher: "Phạm Văn Đức",
      status: "active",
      present: 18,
    },
    {
      id: 5,
      name: "Mầm 3A",
      students: 23,
      teacher: "Hoàng Thị Mai",
      status: "active",
      present: 23,
    },
    {
      id: 6,
      name: "Mầm 3B",
      students: 20,
      teacher: "Võ Văn Tâm",
      status: "active",
      present: 19,
    },
  ]

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Danh Sách Lớp Học</CardTitle>
        <CardDescription>Tình hình các lớp học hôm nay</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-semibold">
                    {classItem.name.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{classItem.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    GV: {classItem.teacher}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {classItem.present}/{classItem.students} học sinh
                  </p>
                  <p className="text-xs text-muted-foreground">Có mặt hôm nay</p>
                </div>
                <Badge
                  variant={
                    classItem.present === classItem.students
                      ? "default"
                      : "secondary"
                  }
                >
                  {classItem.present === classItem.students
                    ? "Đầy đủ"
                    : `${classItem.students - classItem.present} vắng`}
                </Badge>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

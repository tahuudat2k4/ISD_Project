import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { classService } from "@/services/classService"

export function StudentListForm({ open, onOpenChange, student, onSubmit }) {
  const [classes, setClasses] = useState([])
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    gender: "",
    dob: "",
    address: "",
    phone: "",
    className: "",
    classId: "",
    health: "",
    notes: "",
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await classService.getClasses()
        setClasses(res?.data || [])
      } catch (error) {
        console.error("Error fetching classes:", error)
      }
    }
    if (open) {
      fetchClasses()
    }
  }, [open])

  useEffect(() => {
    if (student) {
      setFormData(student)
    } else {
      setFormData({
        code: "",
        name: "",
        gender: "",
        dob: "",
        address: "",
        phone: "",
        className: "",
        classId: "",
        health: "",
        notes: "",
      })
    }
  }, [student])

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    onOpenChange(false)
  }

  const isFormValid = formData.code && formData.name && formData.classId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{student ? "Cập nhật học sinh" : "Thêm học sinh mới"}</DialogTitle>
          <DialogDescription>
            Điền thông tin học sinh vào form dưới đây
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="code">Mã số *</Label>
              <Input
                id="code"
                placeholder="HS001"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Ngày sinh</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Họ tên *</Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="className">Lớp *</Label>
              <Select 
                value={formData.classId} 
                onValueChange={(value) => {
                  const selectedClass = classes.find(c => c._id === value)
                  handleChange("classId", value)
                  handleChange("className", selectedClass?.tenlop || "")
                }}
              >
                <SelectTrigger id="className">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.tenlop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="health">Sức khỏe</Label>
              <Select value={formData.health} onValueChange={(value) => handleChange("health", value)}>
                <SelectTrigger id="health">
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tốt">Tốt</SelectItem>
                  <SelectItem value="Khá">Khá</SelectItem>
                  <SelectItem value="Trung bình">Trung bình</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú về học sinh (nếu có)..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {student ? "Cập nhật" : "Thêm mới"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

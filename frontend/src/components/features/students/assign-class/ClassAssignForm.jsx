import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { classOptions } from "./classAssignmentData"

export function ClassAssignForm({ open, onOpenChange, student, onSubmit }) {
  const [targetClass, setTargetClass] = useState("")

  const handleSubmit = () => {
    if (!targetClass) return
    onSubmit(student, targetClass)
    setTargetClass("")
    onOpenChange(false)
  }

  if (!student) return null

  const targetLabel = classOptions.find(opt => opt.value === targetClass)?.label

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Chuyển lớp học sinh</DialogTitle>
          <DialogDescription>
            Chọn lớp đích để chuyển học sinh
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Student Info */}
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <div className="text-sm font-medium">{student.name}</div>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">{student.code}</Badge>
              <Badge variant="secondary" className="text-xs">{student.className}</Badge>
            </div>
          </div>

          {/* Select Target Class */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Lớp đích</label>
            <Select value={targetClass} onValueChange={setTargetClass}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                {classOptions
                  .filter(opt => opt.label !== student.className)
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {targetLabel && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-xs text-green-700">
                <div className="font-medium mb-1">Xác nhận chuyển:</div>
                <div>{student.className} → {targetLabel}</div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!targetClass}>
            Chuyển lớp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

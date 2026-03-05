import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CRITERIA = [
  { id: "teaching", label: "Năng lực giảng dạy", maxScore: 10 },
  { id: "student_care", label: "Chăm sóc học sinh", maxScore: 10 },
  { id: "discipline", label: "Kỷ luật làm việc", maxScore: 10 },
  { id: "teamwork", label: "Làm việc nhóm", maxScore: 10 },
]

export function EvaluationForm({ open, onOpenChange, teacher, onSubmit }) {
  const [scores, setScores] = useState({
    teaching: "",
    student_care: "",
    discipline: "",
    teamwork: "",
  })
  const [comment, setComment] = useState("")

  const handleScoreChange = (criteriaId, value) => {
    setScores((prev) => ({ ...prev, [criteriaId]: value }))
  }

  const calculateTotalScore = () => {
    const values = Object.values(scores).filter((s) => s !== "")
    if (values.length === 0) return 0
    const sum = values.reduce((acc, val) => acc + parseFloat(val), 0)
    return (sum / values.length).toFixed(1)
  }

  const handleSubmit = () => {
    const totalScore = calculateTotalScore()
    onSubmit({
      teacherId: teacher?.id,
      scores,
      comment,
      totalScore: parseFloat(totalScore),
    })
    // Reset form
    setScores({
      teaching: "",
      student_care: "",
      discipline: "",
      teamwork: "",
    })
    setComment("")
  }

  const isFormValid = Object.values(scores).every((s) => s !== "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đánh giá giáo viên</DialogTitle>
          <DialogDescription>
            {teacher?.name} - {teacher?.role}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {CRITERIA.map((criteria) => (
            <div key={criteria.id} className="space-y-2">
              <Label htmlFor={criteria.id}>
                {criteria.label} <span className="text-xs text-muted-foreground">(/{criteria.maxScore})</span>
              </Label>
              <Select
                value={scores[criteria.id]}
                onValueChange={(value) => handleScoreChange(criteria.id, value)}
              >
                <SelectTrigger id={criteria.id}>
                  <SelectValue placeholder="Chọn điểm" />
                </SelectTrigger>
                <SelectContent>
                  {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => (
                    <SelectItem key={score} value={score.toString()}>
                      {score} điểm
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="comment">Nhận xét</Label>
            <Textarea
              id="comment"
              placeholder="Nhập nhận xét chi tiết..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          {isFormValid && (
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-xs text-muted-foreground">Điểm tổng kết</div>
              <div className="text-3xl font-bold text-primary">{calculateTotalScore()}/10</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            Lưu đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

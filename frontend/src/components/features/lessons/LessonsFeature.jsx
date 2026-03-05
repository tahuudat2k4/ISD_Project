import { useState, useMemo } from "react"
import { LessonsFilters } from "./LessonsFilters"
import { LessonsStats } from "./LessonsStats"
import { LessonsTable } from "./LessonsTable"
import { LessonsDetails } from "./LessonsDetails"
import { mockLessons } from "./lessonsData"

export function LessonsFeature() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredLessons = useMemo(() => {
    return mockLessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClass = selectedClass === "all" || lesson.className === selectedClass

      const matchesStatus = selectedStatus === "all" || lesson.status === selectedStatus

      const matchesTopic = selectedTopic === "all" || lesson.topic === selectedTopic

      const matchesDate = !selectedDate || lesson.date === selectedDate

      return matchesSearch && matchesClass && matchesStatus && matchesTopic && matchesDate
    })
  }, [searchTerm, selectedClass, selectedStatus, selectedTopic, selectedDate])

  const stats = useMemo(() => {
    return {
      total: filteredLessons.length,
      inProgress: filteredLessons.filter((l) => l.status === "Đang dạy").length,
      completed: filteredLessons.filter((l) => l.status === "Đã hoàn thành").length,
    }
  }, [filteredLessons])

  const handleViewDetails = (lesson) => {
    setSelectedLesson(lesson)
    setIsDetailsOpen(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Bài giảng</h1>
      </div>

      <LessonsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedClass={selectedClass}
        onClassChange={setSelectedClass}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedTopic={selectedTopic}
        onTopicChange={setSelectedTopic}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      <LessonsStats stats={stats} />

      <LessonsTable lessons={filteredLessons} onViewDetails={handleViewDetails} />

      <LessonsDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        lesson={selectedLesson}
      />
    </div>
  )
}

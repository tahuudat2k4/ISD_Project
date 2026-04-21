import { useEffect, useMemo, useState } from "react"
import { LessonsFilters } from "./LessonsFilters"
import { LessonsTable } from "./LessonsTable"
import { LessonsDetails } from "./LessonsDetails"
import { LessonsForm } from "./LessonsForm"
import { classService } from "@/services/classService"
import { authService } from "@/services/authService"
import { lessonService } from "@/services/lessonService"
import { toast } from "sonner"

const normalizeText = (value = "") => {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

const resolveLessonGradeValue = (classItem) => {
  const gradeCode = normalizeText(classItem?.khoiId?.makhoi)
  const gradeName = normalizeText(classItem?.khoiId?.tenkhoi)

  if (gradeCode === "mam" || gradeName.includes("mam")) {
    return "mam"
  }

  if (gradeCode === "choi" || gradeName.includes("choi")) {
    return "choi"
  }

  if (gradeCode === "la" || gradeName.includes("la")) {
    return "la"
  }

  return "all"
}

export function LessonsFeature() {
  const currentUser = authService.getCurrentUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")
  const [lessons, setLessons] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [editingLesson, setEditingLesson] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [classes, setClasses] = useState([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [isLoadingLessons, setIsLoadingLessons] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingLessonId, setDeletingLessonId] = useState("")

  const loadLessons = async () => {
    try {
      setIsLoadingLessons(true)
      const response = await lessonService.getLessons()
      setLessons(Array.isArray(response?.data) ? response.data : [])
    } catch (error) {
      console.error("Error loading lessons:", error)
      setLessons([])
      toast.error(error?.response?.data?.message || "Không thể tải danh sách bài giảng")
    } finally {
      setIsLoadingLessons(false)
    }
  }

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setIsLoadingClasses(true)
        const response = await classService.getClasses()
        const nextClasses = Array.isArray(response?.data) ? response.data : []
        setClasses(nextClasses)
        setSelectedClass((currentSelectedClass) => {
          if (currentSelectedClass !== "all" && nextClasses.some((classItem) => classItem._id === currentSelectedClass)) {
            return currentSelectedClass
          }

          if (currentUser?.role === "TEACHER" && currentUser?.teacherId) {
            const currentTeacherClass = nextClasses.find(
              (classItem) => String(classItem?.giaoVienId?._id || classItem?.giaoVienId || "") === String(currentUser.teacherId)
            )

            return currentTeacherClass?._id || "all"
          }

          return "all"
        })
      } catch (error) {
        console.error("Error loading lesson classes:", error)
        setClasses([])
        toast.error(error?.response?.data?.message || "Không thể tải danh sách lớp")
      } finally {
        setIsLoadingClasses(false)
      }
    }

    loadClasses()
    loadLessons()
  }, [currentUser?.role, currentUser?.teacherId])

  const classOptions = useMemo(() => {
    return classes
      .map((classItem) => ({
        id: classItem._id,
        name: classItem.tenlop,
        grade: resolveLessonGradeValue(classItem),
        gradeCode: classItem?.khoiId?.makhoi || "",
        gradeName: classItem?.khoiId?.tenkhoi || "",
        teacherName: classItem?.giaoVienId?.hotenGV || "",
        isCurrentTeacherClass:
          currentUser?.role === "TEACHER" &&
          Boolean(currentUser?.teacherId) &&
          String(classItem?.giaoVienId?._id || classItem?.giaoVienId || "") === String(currentUser.teacherId),
        canCreateLesson:
          currentUser?.role === "ADMIN" ||
          (
            currentUser?.role === "TEACHER" &&
            Boolean(currentUser?.teacherId) &&
            String(classItem?.giaoVienId?._id || classItem?.giaoVienId || "") === String(currentUser.teacherId)
          ),
      }))
      .sort((firstClass, secondClass) => firstClass.name.localeCompare(secondClass.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }))
  }, [classes, currentUser?.role, currentUser?.teacherId])

  useEffect(() => {
    if (selectedClass === "all") {
      return
    }

    const classStillAvailable = classOptions.some((classItem) => classItem.id === selectedClass)

    if (!classStillAvailable) {
      setSelectedClass("all")
    }
  }, [classOptions, selectedClass])

  const selectedClassOption = useMemo(() => {
    return classOptions.find((classItem) => classItem.id === selectedClass) || null
  }, [classOptions, selectedClass])

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lesson.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesClass = selectedClass === "all" || lesson.classId === selectedClass

      const matchesTopic = selectedTopic === "all" || lesson.topic === selectedTopic

      const matchesDate = !selectedDate || lesson.date === selectedDate

      return matchesSearch && matchesClass && matchesTopic && matchesDate
    })
  }, [lessons, searchTerm, selectedClass, selectedTopic, selectedDate])

  const canCreateLesson = Boolean(selectedClassOption?.canCreateLesson)
  const createDisabledReason = selectedClass === "all"
    ? "Chọn một lớp để thêm bài giảng mới"
    : canCreateLesson
      ? ""
      : "Bạn chỉ có thể thêm bài giảng cho lớp mình phụ trách"

  const handleViewDetails = (lesson) => {
    setSelectedLesson(lesson)
    setIsDetailsOpen(true)
  }

  const handleOpenCreateDialog = () => {
    if (!selectedClassOption) {
      toast.error("Vui lòng chọn lớp trước khi thêm bài giảng")
      return
    }

    if (!selectedClassOption.canCreateLesson) {
      toast.error("Bạn không thể thêm bài giảng cho lớp này")
      return
    }

    setEditingLesson(null)
    setIsFormOpen(true)
  }

  const handleOpenEditDialog = (lesson) => {
    if (!lesson?.canManageClass) {
      toast.error("Bạn không thể chỉnh sửa bài giảng này")
      return
    }

    setEditingLesson(lesson)
    setIsFormOpen(true)
  }

  const handleFormOpenChange = (open) => {
    setIsFormOpen(open)

    if (!open) {
      setEditingLesson(null)
    }
  }

  const handleCreateLesson = async (payload) => {
    try {
      setIsSubmitting(true)
      const response = await lessonService.createLesson(payload)
      const createdLesson = response?.data

      if (createdLesson) {
        setLessons((currentLessons) => [createdLesson, ...currentLessons])
        setSelectedLesson(createdLesson)
      } else {
        await loadLessons()
      }

      toast.success(response?.message || "Đã tạo bài giảng mới")
      return true
    } catch (error) {
      console.error("Error creating lesson:", error)
      toast.error(error?.response?.data?.message || "Không thể tạo bài giảng mới")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateLesson = async (payload) => {
    if (!editingLesson?.id) {
      return false
    }

    try {
      setIsSubmitting(true)
      const response = await lessonService.updateLesson(editingLesson.id, payload)
      const updatedLesson = response?.data

      if (updatedLesson) {
        setLessons((currentLessons) => currentLessons.map((lesson) => (
          lesson.id === updatedLesson.id ? updatedLesson : lesson
        )))

        setSelectedLesson((currentLesson) => (
          currentLesson?.id === updatedLesson.id ? updatedLesson : currentLesson
        ))
      } else {
        await loadLessons()
      }

      toast.success(response?.message || "Đã cập nhật bài giảng")
      return true
    } catch (error) {
      console.error("Error updating lesson:", error)
      toast.error(error?.response?.data?.message || "Không thể cập nhật bài giảng")
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitLesson = async (payload) => {
    if (editingLesson?.id) {
      return handleUpdateLesson(payload)
    }

    return handleCreateLesson(payload)
  }

  const handleDeleteLesson = async (lesson) => {
    if (!lesson?.canManageClass) {
      toast.error("Bạn không thể xóa bài giảng này")
      return
    }

    const isConfirmed = window.confirm(`Xóa bài giảng ${lesson.code} - ${lesson.title}?`)
    if (!isConfirmed) {
      return
    }

    try {
      setDeletingLessonId(lesson.id)
      const response = await lessonService.deleteLesson(lesson.id)

      setLessons((currentLessons) => currentLessons.filter((currentLesson) => currentLesson.id !== lesson.id))
      setSelectedLesson((currentLesson) => (
        currentLesson?.id === lesson.id ? null : currentLesson
      ))

      if (selectedLesson?.id === lesson.id) {
        setIsDetailsOpen(false)
      }

      if (editingLesson?.id === lesson.id) {
        setEditingLesson(null)
        setIsFormOpen(false)
      }

      toast.success(response?.message || "Đã xóa bài giảng")
    } catch (error) {
      console.error("Error deleting lesson:", error)
      toast.error(error?.response?.data?.message || "Không thể xóa bài giảng")
    } finally {
      setDeletingLessonId("")
    }
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
        selectedTopic={selectedTopic}
        onTopicChange={setSelectedTopic}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        classOptions={classOptions}
        isLoadingClasses={isLoadingClasses || isLoadingLessons}
      />

      <LessonsTable
        lessons={filteredLessons}
        onViewDetails={handleViewDetails}
        onEditLesson={handleOpenEditDialog}
        onDeleteLesson={handleDeleteLesson}
        onCreateLesson={handleOpenCreateDialog}
        canCreateLesson={canCreateLesson}
        createDisabledReason={createDisabledReason}
        deletingLessonId={deletingLessonId}
      />

      <LessonsDetails
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        lesson={selectedLesson}
      />

      <LessonsForm
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        lesson={editingLesson}
        onSubmit={handleSubmitLesson}
        classOptions={classOptions}
        selectedClassId={editingLesson?.classId || selectedClassOption?.id || ""}
        submitting={isSubmitting}
      />
    </div>
  )
}

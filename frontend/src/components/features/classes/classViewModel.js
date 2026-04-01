export const CLASS_STATUSES = ["Hoạt động", "Tạm dừng", "Kế hoạch"]

const DEFAULT_CAPACITY = 30

const normalizeText = (value = "") => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

const formatDate = (value) => {
  if (!value) {
    return "Chưa cập nhật"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Chưa cập nhật"
  }

  return date.toLocaleDateString("vi-VN")
}

const matchesGrade = (grade, gradeKeyword) => {
  const normalizedKeyword = normalizeText(gradeKeyword)
  const gradeName = normalizeText(grade?.tenkhoi)
  const gradeCode = normalizeText(grade?.makhoi)

  return gradeName.includes(normalizedKeyword) || gradeCode.includes(normalizedKeyword)
}

export const findGradeByKeyword = (grades = [], gradeKeyword) => {
  return grades.find((grade) => matchesGrade(grade, gradeKeyword)) || null
}

const getTeacherName = (teacher) => {
  if (!teacher) {
    return "Chưa phân công"
  }

  return teacher.hotenGV || teacher.name || teacher.username || "Chưa phân công"
}

const compareClassCodes = (firstCode = "", secondCode = "") => {
  return String(firstCode).localeCompare(String(secondCode), undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

export const buildClassViewModels = (classes = [], students = [], gradeKeyword) => {
  const studentCountByClassId = new Map()

  students.forEach((student) => {
    const classId = student?.lopId?._id || student?.lopId
    if (!classId) {
      return
    }

    const key = String(classId)
    studentCountByClassId.set(key, (studentCountByClassId.get(key) || 0) + 1)
  })

  return classes
    .filter((classItem) => matchesGrade(classItem?.khoiId, gradeKeyword))
    .map((classItem) => {
      const currentStudents = studentCountByClassId.get(String(classItem._id)) || 0
      const configuredCapacity = Number(classItem.succhua) > 0 ? Number(classItem.succhua) : DEFAULT_CAPACITY
      const capacity = Math.max(configuredCapacity, currentStudents)
      const gradeName = classItem?.khoiId?.tenkhoi || gradeKeyword

      return {
        id: classItem._id,
        code: classItem.malop,
        name: classItem.tenlop,
        description: `Khối ${gradeName}`,
        mainTeacher: getTeacherName(classItem.giaoVienId),
        mainTeacherId: classItem?.giaoVienId?._id || classItem?.giaoVienId || "",
        gradeId: classItem?.khoiId?._id || classItem?.khoiId || "",
        gradeName,
        assistantTeacher: classItem.giaovienphutro || "Chưa cập nhật",
        currentStudents,
        capacity,
        room: classItem.phonghoc || "Chưa cập nhật",
        status: classItem.status || "Hoạt động",
        schedule: classItem.giohoc || "Chưa cập nhật",
        established: formatDate(classItem.ngaythanhlap || classItem.createdAt),
        establishedRaw: classItem.ngaythanhlap || classItem.createdAt || "",
        facilities: Array.isArray(classItem.cosovatchat) ? classItem.cosovatchat : [],
        notes: classItem.ghichu || "Chưa có ghi chú",
        raw: classItem,
      }
    })
    .sort((firstClass, secondClass) => compareClassCodes(firstClass.code, secondClass.code))
}
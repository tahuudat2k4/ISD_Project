// Mock data for student records (học bạ)
export const mockStudentRecords = [
  {
    id: "S001",
    code: "HS001",
    name: "Nguyễn Minh An",
    className: "Mầm 1",
    averageScore: 8.5,
    attendance: "95%",
    behavior: "Tốt",
    subjects: [
      { name: "Toán", score: 8.5, status: "Xuất sắc" },
      { name: "Tiếng Việt", score: 8.0, status: "Tốt" },
      { name: "Khoa học", score: 8.5, status: "Xuất sắc" },
      { name: "Mỹ thuật", score: 9.0, status: "Xuất sắc" },
    ],
    notes: "Học sinh chăm chỉ, tham gia hoạt động lớp tích cực",
  },
  {
    id: "S002",
    code: "HS002",
    name: "Trần Thảo My",
    className: "Mầm 1",
    averageScore: 7.8,
    attendance: "92%",
    behavior: "Tốt",
    subjects: [
      { name: "Toán", score: 7.5, status: "Tốt" },
      { name: "Tiếng Việt", score: 8.0, status: "Tốt" },
      { name: "Khoa học", score: 7.5, status: "Tốt" },
      { name: "Mỹ thuật", score: 8.5, status: "Xuất sắc" },
    ],
    notes: "Học sinh lễ phép, hợp tác tốt với bạn bè",
  },
  {
    id: "S003",
    code: "HS003",
    name: "Lê Hoàng Nam",
    className: "Chồi 2",
    averageScore: 8.2,
    attendance: "98%",
    behavior: "Xuất sắc",
    subjects: [
      { name: "Toán", score: 8.0, status: "Tốt" },
      { name: "Tiếng Việt", score: 8.5, status: "Xuất sắc" },
      { name: "Khoa học", score: 8.0, status: "Tốt" },
      { name: "Mỹ thuật", score: 8.5, status: "Xuất sắc" },
    ],
    notes: "Học sinh giỏi, luôn hoàn thành tốt các bài tập",
  },
  {
    id: "S004",
    code: "HS004",
    name: "Phạm Thu Hà",
    className: "Chồi 1",
    averageScore: 7.5,
    attendance: "88%",
    behavior: "Khá",
    subjects: [
      { name: "Toán", score: 7.0, status: "Khá" },
      { name: "Tiếng Việt", score: 7.5, status: "Tốt" },
      { name: "Khoa học", score: 7.5, status: "Tốt" },
      { name: "Mỹ thuật", score: 8.0, status: "Tốt" },
    ],
    notes: "Cần cải thiện tập trung trong giờ học",
  },
  {
    id: "S005",
    code: "HS005",
    name: "Võ Minh Quân",
    className: "Lá 1",
    averageScore: 8.7,
    attendance: "99%",
    behavior: "Xuất sắc",
    subjects: [
      { name: "Toán", score: 9.0, status: "Xuất sắc" },
      { name: "Tiếng Việt", score: 8.5, status: "Xuất sắc" },
      { name: "Khoa học", score: 8.5, status: "Xuất sắc" },
      { name: "Mỹ thuật", score: 9.0, status: "Xuất sắc" },
    ],
    notes: "Học sinh đạt tiêu chuẩn xuất sắc, tích cực giúp đỡ bạn",
  },
]

export const allClasses = [
  "Mầm 1",
  "Mầm 2",
  "Mầm 3",
  "Chồi 1",
  "Chồi 2",
  "Lá 1",
]

export const allSubjects = [
  "Toán",
  "Tiếng Việt",
  "Khoa học",
  "Mỹ thuật",
]

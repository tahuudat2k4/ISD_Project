// Mock data for lessons feature
export const mockLessons = [
  {
    id: "LS001",
    code: "BG001",
    title: "Làm quen chữ cái A",
    grade: "mam",
    className: "Mầm 1",
    teacher: "Chị Hoa",
    date: "2026-02-04",
    duration: "45 phút",
    status: "Sắp tới",
    topic: "Ngôn ngữ",
    room: "Phòng 101",
    objectives: ["Nhận biết chữ A", "Phát âm chuẩn", "Tô chữ A"],
    materials: ["Thẻ chữ", "Bảng", "Bút màu"],
    notes: "Chuẩn bị thẻ chữ lớn cho học sinh quan sát",
  },
  {
    id: "LS002",
    code: "BG002",
    title: "Toán: Đếm 1-5",
    grade: "mam",
    className: "Mầm 2",
    teacher: "Chị Hương",
    date: "2026-02-03",
    duration: "40 phút",
    status: "Đang dạy",
    topic: "Toán",
    room: "Phòng 102",
    objectives: ["Đếm 1-5", "Nhận biết số lượng"],
    materials: ["Que tính", "Hình minh họa"],
    notes: "Cho học sinh thực hành nhóm nhỏ",
  },
  {
    id: "LS003",
    code: "BG003",
    title: "Mỹ thuật: Vẽ bông hoa",
    grade: "choi",
    className: "Chồi 1",
    teacher: "Cô Minh",
    date: "2026-02-02",
    duration: "50 phút",
    status: "Đã hoàn thành",
    topic: "Mỹ thuật",
    room: "Phòng 201",
    objectives: ["Nhận biết màu sắc", "Thực hành vẽ"],
    materials: ["Giấy A4", "Bút chì", "Màu sáp"],
    notes: "Học sinh hoàn thành tốt",
  },
  {
    id: "LS004",
    code: "BG004",
    title: "Âm nhạc: Hát bài Con chim non",
    grade: "choi",
    className: "Chồi 2",
    teacher: "Cô Thủy",
    date: "2026-02-03",
    duration: "35 phút",
    status: "Đang dạy",
    topic: "Âm nhạc",
    room: "Phòng 202",
    objectives: ["Ghi nhớ lời", "Phát âm rõ"],
    materials: ["Loa", "Nhạc nền"],
    notes: "Khuyến khích học sinh biểu diễn",
  },
  {
    id: "LS005",
    code: "BG005",
    title: "Kỹ năng: Rửa tay đúng cách",
    grade: "la",
    className: "Lá 1",
    teacher: "Cô Trang",
    date: "2026-02-05",
    duration: "30 phút",
    status: "Sắp tới",
    topic: "Kỹ năng sống",
    room: "Phòng 301",
    objectives: ["Nhận biết 6 bước rửa tay", "Tạo thói quen sạch"],
    materials: ["Xà phòng", "Tranh minh họa"],
    notes: "Chuẩn bị dụng cụ rửa tay",
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

export const gradeOptions = [
  { value: "all", label: "Tất cả khối" },
  { value: "mam", label: "Khối Mầm" },
  { value: "choi", label: "Khối Chồi" },
  { value: "la", label: "Khối Lá" },
]

export const classByGrade = {
  mam: ["Mầm 1", "Mầm 2", "Mầm 3"],
  choi: ["Chồi 1", "Chồi 2"],
  la: ["Lá 1"],
}

export const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "Sắp tới", label: "Sắp tới" },
  { value: "Đang dạy", label: "Đang dạy" },
  { value: "Đã hoàn thành", label: "Đã hoàn thành" },
]

export const topics = ["Ngôn ngữ", "Toán", "Mỹ thuật", "Âm nhạc", "Kỹ năng sống"]

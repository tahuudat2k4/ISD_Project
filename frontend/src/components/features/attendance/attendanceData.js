// Mock data for attendance feature
export const mockAttendanceRecords = [
  {
    id: "AT001",
    studentCode: "HS001",
    studentName: "Nguyễn Minh An",
    className: "Mầm 1",
    date: "2026-02-03",
    status: "Có mặt",
    checkIn: "07:25",
    checkOut: "16:20",
    note: "Đến đúng giờ",
  },
  {
    id: "AT002",
    studentCode: "HS002",
    studentName: "Trần Thảo My",
    className: "Mầm 1",
    date: "2026-02-03",
    status: "Đi muộn",
    checkIn: "08:10",
    checkOut: "16:15",
    note: "Kẹt xe",
  },
  {
    id: "AT003",
    studentCode: "HS003",
    studentName: "Lê Hoàng Nam",
    className: "Chồi 2",
    date: "2026-02-03",
    status: "Vắng",
    checkIn: "-",
    checkOut: "-",
    note: "Ốm",
  },
  {
    id: "AT004",
    studentCode: "HS004",
    studentName: "Phạm Thu Hà",
    className: "Chồi 1",
    date: "2026-02-03",
    status: "Có mặt",
    checkIn: "07:30",
    checkOut: "16:25",
    note: "-",
  },
  {
    id: "AT005",
    studentCode: "HS005",
    studentName: "Võ Minh Quân",
    className: "Lá 1",
    date: "2026-02-03",
    status: "Có mặt",
    checkIn: "07:20",
    checkOut: "16:30",
    note: "-",
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

export const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "Có mặt", label: "Có mặt" },
  { value: "Vắng", label: "Vắng" },
  { value: "Đi muộn", label: "Đi muộn" },
]

// Mock data for teacher schedule
// Structure: scheduleData[dayIndex][timeSlotIndex]
export const mockScheduleData = [
  // Monday (Thứ 2)
  [
    { className: "Mầm 1", subject: "Toán", room: "P.M1", students: 28 },
    { className: "Mầm 1", subject: "Tiếng Việt", room: "P.M1", students: 28 },
    null, // Empty slot
    { className: "Chồi 1", subject: "Âm nhạc", room: "P.C1", students: 29 },
    null,
  ],
  // Tuesday (Thứ 3)
  [
    { className: "Chồi 2", subject: "Vẽ", room: "P.C2", students: 30 },
    null,
    { className: "Mầm 1", subject: "Thể dục", room: "Sân", students: 28 },
    { className: "Chồi 2", subject: "Toán", room: "P.C2", students: 30 },
    { className: "Chồi 2", subject: "Âm nhạc", room: "P.C2", students: 30 },
  ],
  // Wednesday (Thứ 4)
  [
    { className: "Mầm 1", subject: "Toán", room: "P.M1", students: 28 },
    { className: "Mầm 1", subject: "Âm nhạc", room: "P.M1", students: 28 },
    { className: "Lá 1", subject: "Khoa học", room: "P.L1", students: 32 },
    null,
    { className: "Lá 1", subject: "Tiếng Việt", room: "P.L1", students: 32 },
  ],
  // Thursday (Thứ 5)
  [
    { className: "Chồi 1", subject: "Toán", room: "P.C1", students: 29 },
    { className: "Chồi 1", subject: "Vẽ", room: "P.C1", students: 29 },
    null,
    { className: "Mầm 1", subject: "Khoa học", room: "P.M1", students: 28 },
    null,
  ],
  // Friday (Thứ 6)
  [
    { className: "Lá 1", subject: "Toán", room: "P.L1", students: 32 },
    null,
    { className: "Chồi 1", subject: "Thể dục", room: "Sân", students: 29 },
    { className: "Mầm 1", subject: "Vẽ", room: "P.M1", students: 28 },
    { className: "Mầm 1", subject: "Hoạt động", room: "P.M1", students: 28 },
  ],
]

export const mockStats = {
  totalPeriods: 18,
  totalClasses: 5,
  freePeriods: 7,
  conflicts: 0,
}

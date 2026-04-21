import http from "@/services/httpClient"

export const attendanceService = {
  getClasses: async () => {
    const { data } = await http.get("/attendance/classes")
    return data
  },

  getRecords: async ({ classId, date }) => {
    const { data } = await http.get("/attendance/records", {
      params: { classId, date },
    })
    return data
  },

  saveRecords: async (payload) => {
    const { data } = await http.post("/attendance/records", payload)
    return data
  },
}
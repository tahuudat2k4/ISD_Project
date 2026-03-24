import http from "@/services/httpClient"

export const gradeService = {
  getGrades: async () => {
    const { data } = await http.get("/grades")
    return data
  },
}
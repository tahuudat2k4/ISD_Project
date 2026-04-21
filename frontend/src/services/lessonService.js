import http from "@/services/httpClient"

export const lessonService = {
  getLessons: async () => {
    const { data } = await http.get("/lessons")
    return data
  },

  createLesson: async (payload) => {
    const { data } = await http.post("/lessons", payload)
    return data
  },

  updateLesson: async (lessonId, payload) => {
    const { data } = await http.put(`/lessons/${lessonId}`, payload)
    return data
  },

  deleteLesson: async (lessonId) => {
    const { data } = await http.delete(`/lessons/${lessonId}`)
    return data
  },
}
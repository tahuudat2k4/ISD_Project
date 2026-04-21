import http from "@/services/httpClient"

export const evaluationService = {
  getEvaluationRecords: async ({ classId, date }) => {
    const { data } = await http.get("/evaluations", {
      params: { classId, date },
    })
    return data
  },

  saveEvaluationRecords: async (payload) => {
    const { data } = await http.put("/evaluations", payload)
    return data
  },
}

import http from "@/services/httpClient";

export const teacherService = {
	getTeachers: async () => {
		const { data } = await http.get("/teachers");
		return data;
	},

	getTeacher: async (id) => {
		const { data } = await http.get(`/teachers/${id}`);
		return data;
	},

	createTeacher: async (payload) => {
		const { data } = await http.post("/teachers", payload);
		return data;
	},

	updateTeacher: async (id, payload) => {
		const { data } = await http.put(`/teachers/${id}`, payload);
		return data;
	},

	deleteTeacher: async (id) => {
		const { data } = await http.delete(`/teachers/${id}`);
		return data;
	},
};


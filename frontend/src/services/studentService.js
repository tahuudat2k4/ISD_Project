import http from "@/services/httpClient";

export const studentService = {
	getStudents: async () => {
		const { data } = await http.get("/students");
		return data;
	},

	getStudent: async (id) => {
		const { data } = await http.get(`/students/${id}`);
		return data;
	},

	createStudent: async (payload) => {
		const { data } = await http.post("/students", payload);
		return data;
	},

	updateStudent: async (id, payload) => {
		const { data } = await http.put(`/students/${id}`, payload);
		return data;
	},

	deleteStudent: async (id) => {
		const { data } = await http.delete(`/students/${id}`);
		return data;
	},
};


import http from "@/services/httpClient";

export const teacherService = {
	getTeachers: async () => {
		const { data } = await http.get("/teachers");
		return data;
	},

	getTeacherAccountManagement: async ({ page = 1, limit = 10, query = "" } = {}) => {
		// query param "query" chưa dùng ở backend, nhưng để sẵn nếu muốn mở rộng tìm kiếm server-side
		const params = new URLSearchParams({ page, limit });
		// Nếu có query tìm kiếm thì thêm vào
		if (query) params.append("query", query);
		const { data } = await http.get(`/teachers/account-management?${params.toString()}`);
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

	createTeacherAccount: async (id, payload) => {
		const { data } = await http.post(`/teachers/${id}/account`, payload);
		return data;
	},

	resetTeacherAccountPassword: async (id, payload) => {
		const { data } = await http.patch(`/teachers/${id}/account/password`, payload);
		return data;
	},

	deleteTeacherAccount: async (id) => {
		const { data } = await http.delete(`/teachers/${id}/account`);
		return data;
	},

	updateTeacher: async (id, payload) => {
		const { data } = await http.put(`/teachers/${id}`, payload);
		return data;
	},

	updateMyProfile: async (payload) => {
		const { data } = await http.put('/teachers/me', payload);
		return data;
	},

	deleteTeacher: async (id) => {
		const { data } = await http.delete(`/teachers/${id}`);
		return data;
	},
};


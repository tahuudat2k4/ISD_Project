import http from "@/services/httpClient";

export const classService = {
	getClasses: async () => {
		const { data } = await http.get("/classes");
		return data;
	},

	getClass: async (id) => {
		const { data } = await http.get(`/classes/${id}`);
		return data;
	},

	createClass: async (payload) => {
		const { data } = await http.post("/classes", payload);
		return data;
	},

	updateClass: async (id, payload) => {
		const { data } = await http.put(`/classes/${id}`, payload);
		return data;
	},

	deleteClass: async (id) => {
		const { data } = await http.delete(`/classes/${id}`);
		return data;
	},
};


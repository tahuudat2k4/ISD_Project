import http from "@/services/httpClient";

export const authService = {
  // Đăng nhập
  login: async (username, password) => {
    try {
      const { data } = await http.post("/auth/signin", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || "Đăng nhập thất bại";
      console.error("Login error:", message);
      throw new Error(message);
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  hasRole: (roles = []) => {
    const user = authService.getCurrentUser();
    return !!user?.role && roles.includes(user.role);
  },

  isAdmin: () => {
    return authService.hasRole(["ADMIN"]);
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const { data } = await http.post("/auth/refresh");
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Refresh token error:", error?.response?.data || error);
      authService.logout();
      throw new Error(error?.response?.data?.message || "Refresh token thất bại");
    }
  },
};

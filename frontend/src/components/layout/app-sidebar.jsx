"use client"

import * as React from "react"
import {
  BookOpenText,
  Building2,
  ClipboardCheck,
  Download,
  GraduationCap,
  Home,
  Settings,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/common/nav-main"
import { NavProjects } from "@/components/common/nav-projects"
import { NavUser } from "@/components/common/nav-user"
import { TeamSwitcher } from "@/components/common/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authService } from "@/services/authService"

const teams = [
  {
    name: "KIDORY",
    logo: "/assets/K_logo.png",
    plan: "Hien Giang Kindergarten",
  },
]

const navMain = [
  {
    title: "Trang Chủ",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Giáo Viên",
    url: "/teachers",
    icon: Users,
    items: [
      {
        title: "Danh Sách",
        url: "/teachers",
      },
      {
        title: "Phân Công Giảng Dạy",
        url: "/teachers/assignments",
      },
      {
        title: "Lịch Làm Việc",
        url: "/teachers/schedule",
      },
      {
        title: "Đánh Giá",
        url: "/teachers/evaluation",
      },
    ],
  },
  {
    title: "Học Sinh",
    url: "/students",
    icon: GraduationCap,
    items: [
      {
        title: "Danh Sách",
        url: "/students",
      },
      {
        title: "Phân Lớp",
        url: "/students/assign-class",
      },
      {
        title: "Học Bạ",
        url: "/students/records",
      },
      {
        title: "Sức Khỏe",
        url: "/students/health",
      },
    ],
  },
  {
    title: "Lớp Học",
    url: "/classes",
    icon: Building2,
    items: [
      {
        title: "Lớp Mầm",
        url: "/classes/germ",
      },
      {
        title: "Lớp Chồi",
        url: "/classes/choi",
      },
      {
        title: "Lớp Lá",
        url: "/classes/la",
      },
    ],
  },
  {
    title: "Điểm Danh",
    url: "/attendance",
    icon: ClipboardCheck,
  },
  {
    title: "Bài Giảng",
    url: "/lessons",
    icon: BookOpenText,
  },
  {
    title: "Xếp Loại",
    url: "/evaluation",
    icon: Trophy,
  },
]

const baseProjects = [
  {
    name: "Cài Đặt",
    url: "/settings",
    icon: Settings,
  },
  {
    name: "Xuất Dữ Liệu",
    url: "/export",
    icon: Download,
  },
]

export function AppSidebar({
  ...props
}) {
  const currentUser = authService.getCurrentUser()
  const isAdmin = authService.isAdmin()
  const projects = React.useMemo(() => {
    if (!isAdmin) {
      return baseProjects
    }

    return [
      ...baseProjects,
      {
        name: "Tài Khoản Giáo Viên",
        url: "/teacher-accounts",
        icon: UserCheck,
      },
    ]
  }, [isAdmin])

  const sidebarUser = React.useMemo(() => ({
    name: currentUser?.username || "Người dùng",
    email: isAdmin ? "Quản trị viên" : "Giáo viên",
    avatar: "/avatars/shadcn.jpg",
  }), [currentUser?.username, isAdmin])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

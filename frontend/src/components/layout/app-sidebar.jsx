"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpenText,
  Building2,
  ClipboardCheck,
  Command,
  Download,
  Frame,
  GalleryVerticalEnd,
  GraduationCap,
  Home,
  Map,
  PieChart,
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

// This is sample data.
const data = {
  user: {
    name: "Tạ Hữu Đạt",
    email: "dat.th@hiengiang.com",    
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "KIDORY",
      logo: "/assets/K_logo.png",
      plan: "Hien Giang Kindergarten",
    },
  ],
  navMain: [
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
  ],
  projects: [
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
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

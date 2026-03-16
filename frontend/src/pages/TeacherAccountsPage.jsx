import { AppSidebar } from "@/components/layout/app-sidebar"
import { TeacherAccountsManager } from "@/components/features/teachers/accounts/TeacherAccountsManager"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const TeacherAccountsPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Trang Chủ
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tài Khoản Giáo Viên</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tài Khoản Giáo Viên</h1>
            <p className="text-sm text-muted-foreground">
              Chỉ admin mới có thể tạo tài khoản đăng nhập cho giáo viên trong hệ thống.
            </p>
          </div>
          <TeacherAccountsManager />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default TeacherAccountsPage
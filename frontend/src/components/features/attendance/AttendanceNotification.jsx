import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AttendanceNotification({ message, type, onClose }) {
  if (!message) return null

  const iconMap = {
    success: <CheckCircle className="size-4" />,
    error: <XCircle className="size-4" />,
    info: <AlertCircle className="size-4" />,
  }

  const classMap = {
    success: "border-green-500 bg-green-50",
    error: "border-red-500 bg-red-50",
    info: "border-blue-500 bg-blue-50",
  }

  const titleClassMap = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-blue-800",
  }

  const descriptionClassMap = {
    success: "text-green-700",
    error: "text-red-700",
    info: "text-blue-700",
  }

  return (
    <Alert className={classMap[type] || classMap.info}>
      {iconMap[type]}
      <AlertTitle className={titleClassMap[type]}>
        {type === "success" && "Thành công"}
        {type === "error" && "Lỗi"}
        {type === "info" && "Thông báo"}
      </AlertTitle>
      <AlertDescription className={descriptionClassMap[type]}>
        {message}
      </AlertDescription>
    </Alert>
  )
}

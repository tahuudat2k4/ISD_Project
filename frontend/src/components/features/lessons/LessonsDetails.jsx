import DOMPurify from "dompurify"
import mammoth from "mammoth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Download, ExternalLink, FileText, User } from "lucide-react"

const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const DOC_MIME_TYPE = "application/msword"

const dataUrlToArrayBuffer = (dataUrl) => {
  const [, base64Payload = ""] = String(dataUrl || "").split(",")
  const binary = atob(base64Payload)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes.buffer
}

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")

const openPreviewWindow = ({ title, bodyHtml }) => {
  const previewWindow = window.open("", "_blank")

  if (!previewWindow) {
    return false
  }

  previewWindow.document.open()
  previewWindow.document.write(`<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f7f9;
        --panel: #ffffff;
        --text: #0f172a;
        --muted: #64748b;
        --border: #e2e8f0;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background: var(--bg);
        color: var(--text);
      }
      .page {
        min-height: 100vh;
        padding: 24px;
      }
      .shell {
        max-width: 1100px;
        margin: 0 auto;
      }
      .header {
        margin-bottom: 20px;
      }
      .title {
        margin: 0 0 6px;
        font-size: 24px;
        font-weight: 700;
      }
      .subtitle {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }
      .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
      }
      .image-preview {
        width: 100%;
        max-height: calc(100vh - 160px);
        object-fit: contain;
        display: block;
        margin: 0 auto;
      }
      .docx-preview {
        line-height: 1.65;
      }
      .docx-preview p { margin: 0 0 14px; }
      .docx-preview table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
      .docx-preview td, .docx-preview th { border: 1px solid var(--border); padding: 8px 10px; }
      .docx-preview th { background: #f8fafc; }
      .docx-preview ul, .docx-preview ol { padding-left: 22px; }
      .notice {
        color: var(--muted);
        font-size: 15px;
        line-height: 1.6;
      }
      .actions { margin-top: 20px; }
      .link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 10px;
        background: #0f172a;
        color: #ffffff;
        text-decoration: none;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="shell">
        <div class="header">
          <h1 class="title">${escapeHtml(title)}</h1>
          <p class="subtitle">Xem tài liệu bài giảng</p>
        </div>
        <div class="panel">
          ${bodyHtml}
        </div>
      </div>
    </div>
  </body>
</html>`)
  previewWindow.document.close()
  return true
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="size-4 text-muted-foreground mt-0.5" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium">{value || "Chưa cập nhật"}</div>
      </div>
    </div>
  )
}

export function LessonsDetails({ open, onOpenChange, lesson }) {
  if (!lesson) return null

  const attachment = lesson.attachment || null

  const handleOpenAttachment = async () => {
    if (!attachment?.dataUrl) {
      return
    }

    const title = attachment.fileName || "Tài liệu bài giảng"

    if (attachment.mimeType?.startsWith("image/")) {
      openPreviewWindow({
        title,
        bodyHtml: `<img class="image-preview" src="${attachment.dataUrl}" alt="${escapeHtml(title)}" />`,
      })
      return
    }

    if (attachment.mimeType === DOCX_MIME_TYPE) {
      try {
        const arrayBuffer = dataUrlToArrayBuffer(attachment.dataUrl)
        const result = await mammoth.convertToHtml({ arrayBuffer })
        const sanitizedHtml = DOMPurify.sanitize(result.value || "")

        openPreviewWindow({
          title,
          bodyHtml: `<div class="docx-preview">${sanitizedHtml || "<p class=\"notice\">Tài liệu không có nội dung để hiển thị.</p>"}</div>`,
        })
      } catch (error) {
        console.error("Error opening DOCX preview:", error)
        openPreviewWindow({
          title,
          bodyHtml: `
            <p class="notice">Không thể hiển thị trực tiếp tài liệu này trên web.</p>
            <div class="actions">
              <a class="link" href="${attachment.dataUrl}" download="${escapeHtml(title)}">Tải tài liệu xuống</a>
            </div>
          `,
        })
      }
      return
    }

    if (attachment.mimeType === DOC_MIME_TYPE) {
      openPreviewWindow({
        title,
        bodyHtml: `
          <p class="notice">Định dạng .doc chưa thể hiển thị trực tiếp ổn định trên web. Bạn có thể tải xuống để mở bằng Word.</p>
          <div class="actions">
            <a class="link" href="${attachment.dataUrl}" download="${escapeHtml(title)}">Tải tài liệu xuống</a>
          </div>
        `,
      })
      return
    }

    window.open(attachment.dataUrl, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bài giảng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{lesson.title}</div>
                <div className="text-xs text-muted-foreground">{lesson.code}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{lesson.className}</Badge>
              <Badge variant="secondary">{lesson.topic}</Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-4">
                <InfoRow icon={Calendar} label="Ngày" value={lesson.date} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <InfoRow icon={Clock} label="Thời lượng" value={lesson.duration} />
              </CardContent>
            </Card>
          </div>

          <Separator />

          <div className="space-y-2">
            <InfoRow icon={User} label="Giáo viên" value={lesson.teacher} />
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 text-sm font-medium">Tài liệu đính kèm</h3>
            {attachment ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{attachment.fileName}</div>
                      <div className="text-xs text-muted-foreground">{attachment.mimeType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleOpenAttachment}>
                      <ExternalLink className="size-3.5" />
                      Xem tài liệu
                    </Button>
                    <a href={attachment.dataUrl} download={attachment.fileName} className="inline-flex">
                      <Badge variant="secondary" className="gap-1">
                        <Download className="size-3.5" />
                        Tải xuống
                      </Badge>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Chưa có tài liệu đính kèm</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

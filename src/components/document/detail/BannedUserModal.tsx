import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BannedUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
  moderatedByEmail?: string | null;
  moderationNote?: string | null;
  documentTitle?: string;
  documentId?: number;
}

export default function BannedUserModal({
  isOpen,
  onClose,
  userEmail,
  userName,
  moderatedByEmail,
  moderationNote,
  documentTitle,
  documentId
}: BannedUserModalProps) {
  const { t } = useTranslation();

  const handleSendEmailAppeal = () => {
    const adminEmail = moderatedByEmail || "aistudyhub062026@gmail.com";
    
    const subjectText = `[AI Study Hub] Appeal Document Moderation - ${documentTitle || "Document"}`;
    const bodyText = `Hello AI Study Hub Support Team,\n\n` +
      `My document "${documentTitle || "Document"}" (ID: ${documentId || "N/A"}) has been moderated.\n\n` +
      `Owner Name: ${userName || "N/A"}\n` +
      `Owner Email: ${userEmail || "N/A"}\n\n` +
      `Reason: ${moderationNote || "N/A"}\n\n` +
      `Appeal Details:\n` +
      `[Please write appeal details here]\n`;

    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(bodyText);

    let gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${adminEmail}&su=${subject}&body=${body}`;
    if (userEmail && userEmail.endsWith("@gmail.com")) {
      gmailUrl = `https://mail.google.com/mail/u/${userEmail}/?view=cm&fs=1&to=${adminEmail}&su=${subject}&body=${body}`;
    }

    window.open(gmailUrl, "_blank");

    toast.info(t("admin.redirectingToGmail", "Opening Gmail... Please review and send your appeal in the new tab."));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="overflow-hidden rounded-3xl border border-slate-400/80 dark:border-border/80 bg-card p-0 shadow-2xl sm:max-w-md text-left z-50">
        <div className="bg-gradient-to-b from-red-50/50 to-white dark:from-red-950/10 dark:to-card p-6 space-y-4">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
              <Mail className="h-5 w-5" />
            </div>
            
            <DialogTitle className="text-sm font-black text-red-600 uppercase tracking-wider">
              {t("admin.documentBannedHeader", "Tài liệu bị tạm khoá / ẩn")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              {t("admin.documentBannedMessage", "Tài liệu này đã bị tạm ẩn hoặc khóa do vi phạm chính sách cộng đồng của hệ thống. Bạn có thể nhấn nút dưới để gửi khiếu nại qua email cho Ban quản trị.")}
            </p>

            {moderationNote && (
              <div className="p-3 bg-red-500/5 rounded-xl border border-red-500/10 text-[11px] font-bold text-red-600 dark:text-red-400 space-y-1">
                <p>{t("admin.banReason", "Lý do")}: <span className="font-semibold text-slate-700 dark:text-slate-300">{moderationNote}</span></p>
              </div>
            )}

            {(documentTitle || documentId) && (
              <div className="p-3 bg-secondary/15 rounded-2xl border border-border/30 text-[11px] font-bold text-slate-700 dark:text-muted-foreground space-y-1">
                {documentTitle && <p>{t("admin.documentLabel", "Tài liệu")}: <span className="text-card-foreground">{documentTitle}</span></p>}
                {documentId && <p>{t("admin.documentIdLabel", "Mã tài liệu")}: <span className="text-card-foreground">#{documentId}</span></p>}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              onClick={handleSendEmailAppeal}
              className="w-full sm:w-auto font-black text-xs px-4 py-2 flex items-center justify-center gap-1.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-lg shadow-red-600/10"
            >
              <Mail className="h-3.5 w-3.5" />
              {t("admin.sendViaGmail", "Gửi qua Gmail Web")}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-4 h-9 border border-border bg-secondary hover:bg-secondary/80 text-card-foreground rounded-2xl text-xs font-bold transition-colors cursor-pointer sm:ml-auto"
            >
              {t("common.close", "Đóng")}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

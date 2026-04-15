import { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Stethoscope, RefreshCw, Eye, FileText, SmartphoneNfc } from "lucide-react";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput, ReadOnlyBar } from "@/components/chat/ChatInput";
import { AppointmentProtocolsPanel } from "@/components/protocols/AppointmentProtocolsPanel";
import { AppointmentDevicesPanel } from "@/components/devices/AppointmentDevicesPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─── Appointment meta bar ──────────────────────────────────────────────────────
function AppointmentMeta({ id, messages, role }) {
  const msgCount = messages?.length ?? 0;
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-border shrink-0">
      {/* Title area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm truncate">Appointment #{id}</p>
          <Badge
            variant={role === ROLES.DOCTOR ? "doctor" : "patient"}
            className="text-[10px] px-1.5 py-0 shrink-0"
          >
            {role === ROLES.DOCTOR ? "Doctor View" : "Patient View"}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            {msgCount} message{msgCount !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Live updates
          </span>
        </div>
      </div>

      {/* Role icon */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
          role === ROLES.DOCTOR
            ? "bg-brand-blue-100 text-brand-blue-600"
            : "bg-primary/10 text-primary",
        )}
      >
        {role === ROLES.DOCTOR ? (
          <Stethoscope className="h-4 w-4" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
/**
 * Shared Appointment Detail + Chat page.
 * Role-aware:
 *  - doctor  → read-only chat, ReadOnlyBar at bottom
 *  - patient → can send messages, ChatInput at bottom
 *
 * Route params: :id (appointment id)
 */
export function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const isDoctor = role === ROLES.DOCTOR;

  const [panelTab, setPanelTab] = useState("protocols");

  const { data, isLoading, refetch } = useMessages(id, { limit: 100 });
  const messages = data?.items ?? [];

  const { mutate: send, isPending: isSending } = useSendMessage(id);

  const handleSend = useCallback(
    (text) => {
      send({ message: text });
    },
    [send],
  );

  return (
    /*
     * Full-height layout:
     *  - Sticky top bar (back + meta)
     *  - Flex-1 scrollable ChatContainer
     *  - Sticky bottom input / read-only bar
     */
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-2 px-2 py-2 bg-white border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <Separator orientation="vertical" className="h-5" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-auto"
          onClick={() => refetch()}
          aria-label="Refresh messages"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ── Appointment meta ─────────────────────────────────────────────── */}
      <AppointmentMeta id={id} messages={messages} role={role} />

      {/* ── Panel tab switcher + content ─────────────────────────────────── */}
      <div className="shrink-0 px-3 pt-3 space-y-2">
        {/* Tab bar — Device Details tab is doctor-only */}
        <div
          role="tablist"
          aria-label="Appointment panels"
          className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={panelTab === "protocols"}
            aria-controls="panel-protocols"
            onClick={() => setPanelTab("protocols")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
              panelTab === "protocols"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Care Protocols</span>
            <span className="sm:hidden">Protocols</span>
          </button>

          {isDoctor && (
            <button
              type="button"
              role="tab"
              aria-selected={panelTab === "devices"}
              aria-controls="panel-devices"
              onClick={() => setPanelTab("devices")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                panelTab === "devices"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <SmartphoneNfc className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Device Details</span>
              <span className="sm:hidden">Devices</span>
            </button>
          )}
        </div>

        {/* Panel content */}
        <div
          id="panel-protocols"
          role="tabpanel"
          hidden={panelTab !== "protocols"}
        >
          <AppointmentProtocolsPanel appointmentId={id} viewerRole={role} />
        </div>

        {isDoctor && (
          <div
            id="panel-devices"
            role="tabpanel"
            hidden={panelTab !== "devices"}
          >
            <AppointmentDevicesPanel appointmentId={id} viewerRole={role} />
          </div>
        )}
      </div>

      {/* ── Chat messages ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden bg-brand-slate-50/50">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          viewerRole={role}
        />
      </div>

      {/* ── Bottom input bar ─────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-border bg-white px-4 pt-3 pb-4 space-y-2">
        {isDoctor ? (
          <ReadOnlyBar />
        ) : (
          <>
            <ChatInput onSend={handleSend} isSending={isSending} />
            <p className="text-[11px] text-center text-muted-foreground">
              AI responses are for guidance only and do not replace professional
              medical advice.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

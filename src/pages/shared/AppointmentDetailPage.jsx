import { useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Stethoscope,
  RefreshCw,
  Eye,
  FileText,
  SmartphoneNfc,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput, ReadOnlyBar } from "@/components/chat/ChatInput";
import { AppointmentProtocolsPanel } from "@/components/protocols/AppointmentProtocolsPanel";
import { AppointmentDevicesPanel } from "@/components/devices/AppointmentDevicesPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ROLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─── Unified header bar ────────────────────────────────────────────────────────
function Header({ id, messages, role, onBack, onRefresh }) {
  const msgCount = messages?.length ?? 0;
  const isDoctor = role === ROLES.DOCTOR;

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border bg-white px-3 py-2.5 sm:px-4">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="-ml-1 shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Back</span>
      </Button>

      {/* Divider */}
      <div className="h-5 w-px shrink-0 bg-border" />

      {/* Title area */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <div
          className={cn(
            "hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:flex",
            isDoctor
              ? "bg-brand-blue-100 text-brand-blue-600"
              : "bg-primary/10 text-primary",
          )}
        >
          {isDoctor ? (
            <Stethoscope className="h-3.5 w-3.5" />
          ) : (
            <User className="h-3.5 w-3.5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">
              Appointment #{id}
            </p>
            <Badge
              variant={isDoctor ? "doctor" : "patient"}
              className="hidden shrink-0 px-1.5 py-0 text-[10px] sm:inline-flex"
            >
              {isDoctor ? "Doctor View" : "Patient View"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Eye className="h-3 w-3" />
              {msgCount} message{msgCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-green-600">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Refresh */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={onRefresh}
        aria-label="Refresh messages"
      >
        <RefreshCw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ─── Collapsible panels section ───────────────────────────────────────────────
function PanelsSection({ id, role, isDoctor }) {
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("protocols");

  return (
    <div className="shrink-0 border-b border-border bg-white">
      {/* Trigger row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/40"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          {activePanel === "protocols" ? (
            <FileText className="h-3.5 w-3.5 text-primary" />
          ) : (
            <SmartphoneNfc className="h-3.5 w-3.5 text-primary" />
          )}
          <span className="text-xs font-semibold uppercase tracking-wide">
            {activePanel === "protocols" ? "Care Protocols" : "Device Details"}
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="border-t border-border">
          {/* Inner tab bar */}
          {isDoctor && (
            <div
              role="tablist"
              className="flex gap-1 border-b border-border bg-muted/40 px-3 py-2"
            >
              {[
                { id: "protocols", icon: FileText, label: "Care Protocols" },
                { id: "devices", icon: SmartphoneNfc, label: "Device Details" },
              ].map(({ id: tabId, icon: Icon, label }) => (
                <button
                  key={tabId}
                  type="button"
                  role="tab"
                  aria-selected={activePanel === tabId}
                  onClick={() => setActivePanel(tabId)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    activePanel === tabId
                      ? "bg-white text-foreground shadow-sm ring-1 ring-border/40"
                      : "text-muted-foreground hover:bg-white/60 hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Panel content — max height with scroll so it doesn't crush the chat */}
          <div className="max-h-64 overflow-y-auto scrollbar-thin p-3 sm:max-h-72">
            {activePanel === "protocols" && (
              <AppointmentProtocolsPanel appointmentId={id} viewerRole={role} />
            )}
            {isDoctor && activePanel === "devices" && (
              <AppointmentDevicesPanel appointmentId={id} viewerRole={role} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const isDoctor = role === ROLES.DOCTOR;

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasMore,
    isFetchingMore,
    addOptimisticMessage,
    removeOptimisticMessage,
  } = useMessages(id, { limit: 20 });

  const messages = data?.items ?? [];

  const { mutate: send, isPending: isSending } = useSendMessage(id, {
    onMutate: ({ message }) => addOptimisticMessage(message),
    onError: (optId) => removeOptimisticMessage(optId),
    onSettled: async (optId) => {
      await refetch();
      if (optId) removeOptimisticMessage(optId);
    },
  });

  const handleSend = useCallback((text) => send({ message: text }), [send]);

  return (
    <div className="flex h-[calc(100vh-7rem)] max-w-3xl flex-col sm:h-[calc(100vh-8rem)]">
      {/* ── Unified header ───────────────────────────────────────────── */}
      <Header
        id={id}
        messages={messages}
        role={role}
        onBack={() => navigate(-1)}
        onRefresh={() => refetch()}
      />

      {/* ── Collapsible panels ───────────────────────────────────────── */}
      <PanelsSection id={id} role={role} isDoctor={isDoctor} />

      {/* ── Chat messages ────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden bg-brand-slate-50/50">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          viewerRole={role}
          onLoadMore={fetchNextPage}
          hasMore={hasMore}
          isFetchingMore={isFetchingMore}
        />
      </div>

      {/* ── Bottom input bar ─────────────────────────────────────────── */}
      <div className="shrink-0 space-y-2 border-t border-border bg-white px-4 pb-4 pt-3">
        {isDoctor ? (
          <ReadOnlyBar />
        ) : (
          <>
            <ChatInput onSend={handleSend} isSending={isSending} />
            <p className="text-center text-[11px] text-muted-foreground">
              AI responses are for guidance only and do not replace professional
              medical advice.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

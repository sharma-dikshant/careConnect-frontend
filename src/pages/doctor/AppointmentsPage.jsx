import { useState, useCallback, memo } from "react";
import { Plus, RefreshCw, Sparkles } from "lucide-react";
import {
  useAppointments,
  useInitiateCreateAppointment,
  useInitiateDeleteAppointment,
  useConfirmAppointmentOtp,
  useUpdateAppointment,
} from "@/hooks/useAppointments";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { AppointmentTabs } from "@/components/appointments/AppointmentTabs";
import { AppointmentFormModal } from "@/components/appointments/AppointmentFormModal";
import { OtpStep } from "@/components/auth/OtpStep";
import { Button } from "@/components/ui/Button";
import { ModalPortal } from "@/components/ui/ModalPortal";
import { resendOtp } from "@/api/services/auth.service";
import { AI_PatientGuide_Modal } from "@/components/ai/AI_PatientGuide_Modal";

// ─── OTP Action Modal ───────────────────────────────────────────────────────
/**
 * Generic OTP modal used for both appointment create & close flows.
 * Props:
 *  isOpen        : boolean
 *  title         : string
 *  description   : string
 *  patientEmail  : string
 *  otpContext    : { to, type, entityId } | null
 *  onConfirm     : (otp: string) => Promise<void>
 *  onCancel      : () => void
 *  isConfirming  : boolean
 *  error         : string | null
 */
const AppointmentOtpModal = memo(function AppointmentOtpModal({
  isOpen,
  title,
  description,
  otpContext,
  onConfirm,
  onCancel,
  isConfirming,
  error,
}) {
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState(null);

  async function handleResend() {
    if (!otpContext) return;
    setIsResending(true);
    setResendError(null);
    try {
      await resendOtp(otpContext);
    } catch (err) {
      setResendError(err.message);
    } finally {
      setIsResending(false);
    }
  }

  if (!isOpen || !otpContext) return null;

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        aria-modal
        role="dialog"
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={!isConfirming ? onCancel : undefined}
        />
        <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6 space-y-4 animate-fade-in">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* OTP Step */}
          <OtpStep
            email={otpContext.to}
            isLoading={isConfirming}
            error={error ?? resendError}
            onVerify={onConfirm}
            onResend={handleResend}
            isResending={isResending}
          />

          {/* Cancel */}
          <Button
            variant="ghost"
            className="w-full"
            onClick={onCancel}
            disabled={isConfirming}
          >
            Cancel
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
});

// ─── Tab Panel Content ────────────────────────────────────────────────────────
function TabPanel({ id, isVisible, children }) {
  return (
    <div
      id={`tabpanel-${id}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={!isVisible}
      className={isVisible ? "animate-fade-in" : ""}
    >
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function DoctorAppointmentsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState("active");

  // Create modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Edit modal state
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // OTP modal state – shared for both create and delete
  const [otpModal, setOtpModal] = useState(null);
  // otpModal shape:
  //   { type: 'create'|'delete', title, description, otpContext: { to, type, entityId } }
  const [otpError, setOtpError] = useState(null);

  // AI Patient Guide modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const openAiModal = useCallback(() => setAiModalOpen(true), []);
  const closeAiModal = useCallback(() => setAiModalOpen(false), []);
  const handleAttachPatientGuide = useCallback(
    (patientGuide) => {
      // TODO: wire to backend endpoint when ready
      console.info(
        "[CareConnect] Patient guide attached to appointment:",
        patientGuide,
      );
      closeAiModal();
    },
    [closeAiModal],
  );

  // ── Data hooks — separate cache per tab ──────────────────────────────────
  const activeQuery = useAppointments({ active: true, limit: 50 });
  const inactiveQuery = useAppointments({ active: false, limit: 50 });

  const activeAppointments = activeQuery.data?.items ?? [];
  const inactiveAppointments = inactiveQuery.data?.items ?? [];

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutateAsync: initiateCreate, isPending: isInitiatingCreate } =
    useInitiateCreateAppointment();
  const { mutateAsync: initiateDelete, isPending: isInitiatingDelete } =
    useInitiateDeleteAppointment();
  const { mutateAsync: confirmOtp, isPending: isConfirming } =
    useConfirmAppointmentOtp();
  const updateMutation = useUpdateAppointment(editingAppointment?.id);

  // ── Tab switch ───────────────────────────────────────────────────────────
  const handleTabChange = useCallback((tab) => setActiveTab(tab), []);

  // ── Create flow ──────────────────────────────────────────────────────────
  const openCreateModal = useCallback(() => setCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setCreateModalOpen(false), []);

  async function handleCreateFormSubmit(formData) {
    // Step 1: initiate → OTP sent to patient
    const res = await initiateCreate(formData);
    closeCreateModal();

    // Open OTP modal for the doctor to enter the OTP
    setOtpError(null);
    setOtpModal({
      type: "create",
      title: "Confirm Appointment Creation",
      description: `An OTP has been sent to the patient's email. Ask the patient for the code.`,
      otpContext: {
        to: formData.patientEmail,
        type: "appointment-create",
        entityId: res.data.entityId,
      },
    });
  }

  // ── Edit flow ────────────────────────────────────────────────────────────
  const openEditModal = useCallback((apt) => {
    setEditingAppointment(apt);
    setEditModalOpen(true);
  }, []);
  const closeEditModal = useCallback(() => {
    setEditModalOpen(false);
    setEditingAppointment(null);
  }, []);

  async function handleEditFormSubmit(formData) {
    await updateMutation.mutateAsync(formData);
    closeEditModal();
  }

  // ── Delete flow ──────────────────────────────────────────────────────────
  async function handleDeleteRequest(id) {
    const apt = activeAppointments.find((a) => a.id === id);
    // Step 1: initiate → OTP sent to patient
    const res = await initiateDelete(id);

    setOtpError(null);
    setOtpModal({
      type: "delete",
      title: "Confirm Appointment Closure",
      description: `An OTP has been sent to ${apt?.patient?.email ?? "the patient"}. Ask the patient for the code to close this appointment.`,
      otpContext: {
        to: apt?.patient?.email ?? "",
        type: "appointment-close",
        entityId: res.data.entityId,
      },
    });
  }

  // ── OTP confirm ──────────────────────────────────────────────────────────
  async function handleOtpConfirm(otp) {
    setOtpError(null);
    try {
      await confirmOtp({ ...otpModal.otpContext, otp });
      setOtpModal(null);
    } catch (err) {
      setOtpError(err.message);
    }
  }

  function handleOtpCancel() {
    setOtpModal(null);
    setOtpError(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const isActiveTab = activeTab === "active";
  const currentQuery = isActiveTab ? activeQuery : inactiveQuery;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {currentQuery.isLoading
              ? "Loading…"
              : `${isActiveTab ? activeAppointments.length : inactiveAppointments.length} ${isActiveTab ? "active" : "past"} appointments`}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => currentQuery.refetch()}
            aria-label="Refresh appointments"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openAiModal}
            id="ai-patient-guide-btn-appointment"
            className="gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Generate Patient Guide</span>
            <span className="sm:hidden">AI Guide</span>
          </Button>
          <Button
            size="sm"
            onClick={openCreateModal}
            id="create-appointment-btn"
          >
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Segmented tab control */}
      <AppointmentTabs
        activeTab={activeTab}
        onChange={handleTabChange}
        counts={{
          active: activeQuery.isLoading ? undefined : activeAppointments.length,
          inactive: inactiveQuery.isLoading
            ? undefined
            : inactiveAppointments.length,
        }}
      />

      {/* Tab panels */}
      <TabPanel id="active" isVisible={isActiveTab}>
        <AppointmentList
          appointments={activeAppointments}
          isLoading={activeQuery.isLoading}
          error={activeQuery.error}
          role="doctor"
          isActive={true}
          onEdit={openEditModal}
          onDelete={handleDeleteRequest}
          isDeletingId={isInitiatingDelete ? "pending" : null}
          onCreateClick={openCreateModal}
        />
      </TabPanel>

      <TabPanel id="inactive" isVisible={!isActiveTab}>
        <AppointmentList
          appointments={inactiveAppointments}
          isLoading={inactiveQuery.isLoading}
          error={inactiveQuery.error}
          role="doctor"
          isActive={false}
          isDeletingId={null}
        />
      </TabPanel>

      {/* Create Appointment Form Modal */}
      <AppointmentFormModal
        isOpen={createModalOpen}
        onClose={closeCreateModal}
        appointment={null}
        onSubmit={handleCreateFormSubmit}
        isSubmitting={isInitiatingCreate}
      />

      {/* Edit Appointment Form Modal */}
      <AppointmentFormModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        appointment={editingAppointment}
        onSubmit={handleEditFormSubmit}
        isSubmitting={updateMutation.isPending}
      />

      {/* OTP Confirmation Modal (create & delete) */}
      <AppointmentOtpModal
        isOpen={!!otpModal}
        title={otpModal?.title}
        description={otpModal?.description}
        otpContext={otpModal?.otpContext}
        onConfirm={handleOtpConfirm}
        onCancel={handleOtpCancel}
        isConfirming={isConfirming}
        error={otpError}
      />

      {/* AI Patient Guide Modal */}
      <AI_PatientGuide_Modal
        isOpen={aiModalOpen}
        onClose={closeAiModal}
        context="appointment"
        onAttachToAppointment={handleAttachPatientGuide}
      />
    </div>
  );
}

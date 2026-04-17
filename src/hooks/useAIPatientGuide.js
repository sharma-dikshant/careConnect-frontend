import { useState, useRef, useCallback } from "react";
import { generateAIPatientGuide } from "@/api/services/patientGuide.service";
import { generatePDF } from "@/lib/pdfGenerator";

/**
 * Custom hook that manages the full AI patient guide generation flow.
 *
 * Returns markdown string instead of structured section objects.
 *
 * @returns {{
 *   prompt: string,
 *   setPrompt: (v: string) => void,
 *   markdown: string | null,
 *   isEditMode: boolean,
 *   setIsEditMode: (v: boolean) => void,
 *   editedMarkdown: string,
 *   setEditedMarkdown: (v: string) => void,
 *   isLoading: boolean,
 *   error: string | null,
 *   generate: () => Promise<void>,
 *   regenerate: () => Promise<void>,
 *   reset: () => void,
 *   copyToClipboard: () => Promise<void>,
 *   downloadPDF: (contentRef: React.RefObject) => Promise<void>,
 *   saveAsProtocol: (contentRef: React.RefObject, callbacks: object) => Promise<void>,
 * }}
 */
export function useAIPatientGuide() {
  const [prompt, setPrompt] = useState("");
  const [markdown, setMarkdown] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMarkdown, setEditedMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Prevent duplicate in-flight calls
  const isInFlight = useRef(false);

  const _call = useCallback(async (promptText) => {
    if (isInFlight.current) return;
    if (!promptText.trim()) {
      setError("Please describe the patient symptoms before generating.");
      return;
    }

    isInFlight.current = true;
    setIsLoading(true);
    setError(null);
    setMarkdown(null);
    setEditedMarkdown("");
    setIsEditMode(false);

    try {
      const rawMarkdown = await generateAIPatientGuide(promptText.trim());
      setMarkdown(rawMarkdown);
      setEditedMarkdown(rawMarkdown);
    } catch (err) {
      setError(
        err.message ?? "Failed to generate patient guide. Please try again.",
      );
    } finally {
      setIsLoading(false);
      isInFlight.current = false;
    }
  }, []);

  const generate = useCallback(() => _call(prompt), [_call, prompt]);

  const regenerate = useCallback(async () => {
    setMarkdown(null);
    setEditedMarkdown("");
    await _call(prompt);
  }, [_call, prompt]);

  const reset = useCallback(() => {
    setPrompt("");
    setMarkdown(null);
    setEditedMarkdown("");
    setIsEditMode(false);
    setError(null);
    setIsLoading(false);
    setIsSaving(false);
    isInFlight.current = false;
  }, []);

  /** Copy the current markdown (edited or original) to clipboard */
  const copyToClipboard = useCallback(async () => {
    const text = isEditMode ? editedMarkdown : (markdown ?? "");
    if (!text) return;
    await navigator.clipboard.writeText(text);
  }, [isEditMode, editedMarkdown, markdown]);

  /** Download the rendered patient guide as a PDF */
  const downloadPDF = useCallback(async (contentRef) => {
    await generatePDF(contentRef, "careconnect-patient-guide.pdf", {
      download: true,
    });
  }, []);

  /**
   * Generate a PDF blob, then pass it to the caller's upload callback.
   *
   * @param {React.RefObject} contentRef
   * @param {{ onUpload: (blob: Blob, filename: string) => Promise<void> }} callbacks
   */
  const saveAsProtocol = useCallback(async (contentRef, callbacks = {}) => {
    const { onUpload } = callbacks;
    if (!onUpload) return;

    setIsSaving(true);
    try {
      const { blob, filename } = await generatePDF(
        contentRef,
        "careconnect-patient-guide.pdf",
      );
      await onUpload(blob, filename);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    prompt,
    setPrompt,
    markdown,
    isEditMode,
    setIsEditMode,
    editedMarkdown,
    setEditedMarkdown,
    isLoading,
    isSaving,
    error,
    generate,
    regenerate,
    reset,
    copyToClipboard,
    downloadPDF,
    saveAsProtocol,
  };
}

import { createPortal } from 'react-dom'

/**
 * Renders children into document.body via a React Portal.
 * Use this wrapper for every modal/dialog/overlay so they escape
 * the AppShell's stacking context and always render above everything.
 *
 * @example
 * <ModalPortal>
 *   <div className="fixed inset-0 z-[60] ...">...</div>
 * </ModalPortal>
 */
export function ModalPortal({ children }) {
  return createPortal(children, document.body)
}

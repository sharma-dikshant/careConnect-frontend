/**
 * PDF Generator Utility
 *
 * Converts a DOM element reference to a PDF blob using html2pdf.js.
 * Returns both the blob (for upload) and triggers a download if requested.
 */

/**
 * Generate a PDF from a DOM element.
 *
 * @param {React.RefObject} elementRef  – ref pointing to the DOM node to print
 * @param {string} filename             – e.g. "patient-guide.pdf"
 * @param {object} [options]
 * @param {boolean} [options.download]  – if true, automatically triggers browser download
 * @returns {Promise<{ blob: Blob, filename: string }>}
 */
export async function generatePDF(elementRef, filename = 'patient-guide.pdf', options = {}) {
  const { download = false } = options

  const element = elementRef?.current
  if (!element) throw new Error('PDF target element not found')

  // Dynamically import html2pdf.js to keep the initial bundle lean
  const html2pdf = (await import('html2pdf.js')).default

  const pdfOptions = {
    margin: [12, 14, 12, 14],   // top, right, bottom, left in mm
    filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  }

  const worker = html2pdf().set(pdfOptions).from(element)

  if (download) {
    await worker.save()
  }

  const blob = await worker.outputPdf('blob')
  return { blob, filename }
}

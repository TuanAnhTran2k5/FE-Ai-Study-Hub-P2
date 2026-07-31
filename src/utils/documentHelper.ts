/**
 * Formats a document title by appending the extension from the original fileName
 * if it doesn't already have it.
 * 
 * Example:
 *   getFormattedTitle("SRS", "SRS_final.pdf") -> "SRS.pdf"
 *   getFormattedTitle("Report.docx", "Report.docx") -> "Report.docx"
 */
export const getFormattedTitle = (title: string, fileName?: string): string => {
  if (!title) return "";
  if (!fileName) return title;
  
  // Extract extension from fileName (e.g. "pdf", "docx")
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return title;
  
  const suffix = `.${ext}`;
  // Check if title already ends with the suffix (case-insensitive)
  if (title.toLowerCase().endsWith(suffix)) {
    return title;
  }
  
  return `${title}${suffix}`;
};

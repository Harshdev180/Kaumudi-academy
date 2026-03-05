/**
 * Formats a raw ID into a unique Kaumudi Sanskrit Academy Enrollment ID format.
 * Format: KSA-YYYY-XXXXXX where XXXXXX is the last 6 characters of the raw ID.
 * 
 * @param {string} rawId - The original ID from the backend.
 * @param {Date|string} createdAt - The creation date of the student record.
 * @returns {string} - The formatted enrollment ID.
 */
export const formatEnrollmentId = (rawId, createdAt) => {
  if (!rawId) return "KSA-PENDING";
  
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
  const shortId = String(rawId).slice(-6).toUpperCase();
  
  return `KSA-${year}-${shortId}`;
};

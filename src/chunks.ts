export interface DocumentChunk {
  /** Equals sourceRef in PolicyNode. */
  id: string;
  /** Original unmodified text. */
  text: string;
  /** Cleaned text for LLM processing. */
  cleanedText: string;
  page?: number;
  section?: string;
  /** For multi-document (v2). */
  documentId?: string;
  /** For vector Q&A. */
  embedding?: number[];
}

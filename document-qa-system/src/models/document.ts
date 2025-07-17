export interface Document {
  id: string;
  content: string;
  metadata: { source: string; chunkIndex: number; fileSize?: number };
}

export function chunkDocument(content: string, chunkSize: number = 500): string[] {
  // Autonomously adjust chunk size if content is too short
  const effectiveChunkSize = Math.min(chunkSize, content.length);
  const chunks = [];
  for (let i = 0; i < content.length; i += effectiveChunkSize) {
    chunks.push(content.slice(i, i + effectiveChunkSize));
  }
  return chunks.length > 0 ? chunks : [content]; // Ensure at least one chunk
}
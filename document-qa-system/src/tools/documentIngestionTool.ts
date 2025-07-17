import { GoogleDriveProvider } from '../providers/googleDriveProvider';
import { QdrantProvider } from '../providers/qdrantProvider';
import { chunkDocument, Document } from '../models/document';

export class DocumentIngestionTool {
  private driveProvider: GoogleDriveProvider;
  private qdrantProvider: QdrantProvider;
  private collectionName: string;

  constructor(collectionName: string) {
    this.driveProvider = new GoogleDriveProvider();
    this.qdrantProvider = new QdrantProvider();
    this.collectionName = collectionName;
  }

  async ingestDocuments(folderId: string) {
    try {
      console.log('Starting document ingestion...');
      await this.qdrantProvider.createCollection(this.collectionName);
      console.log('Qdrant collection ready.');

      const files = await this.driveProvider.getPdfFiles(folderId);
      console.log(`Total files fetched from Google Drive: ${files.length}`);

      const documents: Document[] = files.flatMap((file, fileIndex) =>
        chunkDocument(file.content).map((chunk, chunkIndex) => {
          console.log(`Chunking "${file.name}" - chunk ${chunkIndex + 1}`);
          return {
            id: `${file.id}-${chunkIndex}`,
            content: chunk,
            metadata: {
              source: file.name,
              chunkIndex,
              fileSize: file.size
            }
          };
        })
      );

      if (documents.length === 0) {
        console.warn('No valid documents found to ingest.');
        return;
      }

      console.log(`Total document chunks to store in Qdrant: ${documents.length}`);
      await this.qdrantProvider.storeDocuments(this.collectionName, documents);
      console.log(`Ingested ${documents.length} chunks from ${files.length} files into Qdrant`);
    } catch (error) {
      console.error('Document ingestion failed:', error);
      throw new Error(`Document ingestion failed: ${(error as Error).message}`);
    }
  }
}

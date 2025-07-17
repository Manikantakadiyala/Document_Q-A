import { QdrantClient } from '@qdrant/js-client-rest';
import { pipeline } from '@xenova/transformers';
import { Document } from '../models/document';
import { v4 as uuidv4 } from 'uuid';

export class QdrantProvider {
  private client: QdrantClient;
  private embedder: any;

  constructor() {
    this.client = new QdrantClient({ host: 'localhost', port: 6333, timeout: 20000,checkCompatibility: false });
    this.initEmbedder();
  }

  private async initEmbedder() {
    try {
      this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    } catch (error) {
      throw new Error(`Failed to initialize embedder: ${(error as Error).message}`);
    }
  }

  async createCollection(collectionName: string) {
    try {
        console.log("it came to create colletion")
      const collections = await this.client.getCollections();
      if (!collections.collections.some((c: any) => c.name === collectionName)) {
        await this.client.createCollection(collectionName, {
          vectors: { size: 384, distance: 'Cosine' },
        });
      }
    } catch (error) {
      throw new Error(`Failed to create Qdrant collection: ${(error as Error).message}`);
    }
  }

async storeDocuments(collectionName: string, documents: Document[]) {
  try {
    const BATCH_SIZE = 100;
    console.log(`Starting document upsert in batches of ${BATCH_SIZE}`);

    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);

      const points = [];

      for (const doc of batch) {
        try {
          const raw = await this.embedder(doc.content, { pooling: 'mean', normalize: true });
          const vector = Array.from(raw.data as number[]);

          // Validate vector
          if (vector.length !== 384 || vector.some(v => typeof v !== 'number')) {
            console.warn(`Invalid vector for doc chunk, skipping`);
            continue;
          }

          points.push({
            id: uuidv4(), 
            vector,
            payload: {
              content: doc.content,
              metadata: doc.metadata,
            },
          });
        } catch (err) {
          console.error(`Error embedding doc chunk:`, err);
        }
      }

      if (points.length > 0) {
        await this.client.upsert(collectionName, { points });
        console.log(`Upserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${points.length} points`);
      } else {
        console.warn(`No valid points in batch ${Math.floor(i / BATCH_SIZE) + 1}`);
      }
    }

    console.log('All document chunks successfully stored in Qdrant');
  } catch (error) {
    throw new Error(`Failed to store documents in Qdrant: ${(error as Error).message}`);
  }
}




async search(collectionName: string, query: string, limit: number = 3) {
  try {
    const raw = await this.embedder(query, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(raw.data as number[]);

    console.log('Searching Qdrant...');
    console.log('Collection:', collectionName);
    console.log('Limit:', limit);
    console.log('Vector length:', queryVector.length);
    console.log('Vector:', queryVector.slice(0, 5), '...');

    const results = await this.client.search(collectionName, {
      vector: queryVector,
      limit,
      with_payload: true,
    });

    return results
      .filter((point: any) => point.score > 0.5)
      .map((point: any) => ({
        content: point.payload?.content,
        metadata: point.payload?.metadata,
        score: point.score,
      }));
  } catch (error) {
    console.error(' Qdrant search error:', error);
    throw new Error(`Failed to search Qdrant: ${(error as Error).message}`);
  }
}

}
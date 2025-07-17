import { QdrantProvider } from '../providers/qdrantProvider';

export class DocumentController {
  private qdrantProvider: QdrantProvider;
  private collectionName: string;

  constructor(collectionName: string) {
    this.qdrantProvider = new QdrantProvider();
    this.collectionName = collectionName;
  }

async answerQuestion(question: string): Promise<string> {
  try {
    console.log('Question received:', question);

    const results = await this.qdrantProvider.search(this.collectionName, question, 5);

    console.log('Qdrant returned results:');
    results.forEach((res, index) => {
      console.log(`[${index + 1}]`, {
        score: res.score,
        contentPreview: res.content.slice(0, 150) + '...',
        metadata: res.metadata
      });
    });

    const context = results.map((res) => res.content).join('\n');

    if (!context) {
      console.log('No relevant content found in Qdrant.');
    } else {
      console.log('Constructed context:\n', context.slice(0, 500) + '...');
    }

    return context || 'No relevant content found.';
  } catch (error) {
    console.error('Failed to generate context:', error);
    throw new Error(`Failed to generate context: ${(error as Error).message}`);
  }
}

}

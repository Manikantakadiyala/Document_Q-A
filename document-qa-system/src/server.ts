import express from 'express';
import cors from 'cors'; 
import { DocumentController } from './controllers/documentController';
import { DocumentIngestionTool } from './tools/documentIngestionTool';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const collectionName = 'documents';
const controller = new DocumentController(collectionName);


app.post('/ingest', async (req, res) => {
  const folderId = process.env.GOOGLE_FOLDER_ID;
  if (!folderId) {
    return res.status(400).json({ error: 'GOOGLE_FOLDER_ID is not set in .env' });
  }
  try {
    const tool = new DocumentIngestionTool(collectionName);
    await tool.ingestDocuments(folderId);
    res.json({ message: 'Documents ingested successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


app.post('/ask', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'question is required' });
  }
  try {
    console.log("---------------------");
    const answer = await controller.answerQuestion(question);
    res.json({ answer });
  } catch (error) {
    console.error("Error in /ask:", error);
    res.status(500).json({ error: (error as Error).message });
  }
});

const PORT = process.env.PORT || 4000; // 🔁 Make sure it runs on 4000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

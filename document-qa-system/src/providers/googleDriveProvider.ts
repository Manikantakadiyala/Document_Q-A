import { google } from 'googleapis';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import pdf from 'pdf-parse';

export class GoogleDriveProvider {
  private drive: any;

  constructor() {
    const keyFile = path.join(__dirname, './service-account.json');
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    this.drive = google.drive({ version: 'v3', auth });
    console.log(' Google Drive client initialized with service account');
  }

async getPdfFiles(folderId: string) {
    console.log(`Fetching PDFs from folder ID: ${folderId}`);
    if (!folderId) throw new Error('Folder ID is required');

    const response = await this.drive.files.list({
      q: `'${folderId}' in parents and mimeType = 'application/pdf'`,
      fields: 'files(id, name, mimeType, size)',
    });

    console.log(' Raw API response:', JSON.stringify(response.data, null, 2));


    const pdfFiles = response.data.files || [];
    console.log(`Found ${pdfFiles.length} PDF files in folder ${folderId}`);

    // Download and extract text from each PDF
    const pdfTexts = await Promise.all(
      pdfFiles.map(async (file: { id: string; name: string; mimeType: string; size?: string }) => {
        try {
          console.log(`⬇Downloading: ${file.name}`);
          const destPath = path.join(os.tmpdir(), `${file.id}.pdf`);
          const dest = await fs.open(destPath, 'w');

          const res = await this.drive.files.get(
            { fileId: file.id, alt: 'media' },
            { responseType: 'stream' }
          );

          const writeStream = (await dest.createWriteStream()) as any;
          await new Promise((resolve, reject) => {
            res.data
              .pipe(writeStream)
              .on('finish', resolve)
              .on('error', reject);
          });

          const buffer = await fs.readFile(destPath);
          const pdfData = await pdf(buffer);

          console.log(`Extracted text from: ${file.name} (${file.size ?? 0} bytes)`);

          return {
            id: file.id,
            name: file.name,
            content: pdfData.text,
            size: file.size ? parseInt(file.size, 10) : 0,
          };
        } catch (err) {
          console.error(` Error processing file ${file.name}:`, err);
          return null;
        }
      })
    );

    return pdfTexts.filter(Boolean); // filter out failed files
  }

}

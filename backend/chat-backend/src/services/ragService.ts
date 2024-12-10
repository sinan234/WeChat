import axios from 'axios';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { extractPDFText, splitTextIntoChunks } from './productService';

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const API_KEY = "AIzaSyD54qt0DRAc1WxSn2_nNjF0c8r5Rq1OfaI";

export class RagService{

    private vectorStore: MemoryVectorStore | null = null;
    private embeddings: GoogleGenerativeAIEmbeddings;
  
    constructor() {
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: API_KEY,
        modelName: 'embedding-001' 
      });
    }
  
    async processPDF(filePath: string): Promise<void> {
      try {
        const pdfText = await extractPDFText(filePath);
        
        const docs = await splitTextIntoChunks(pdfText);
  
        this.vectorStore = await MemoryVectorStore.fromDocuments(
          docs, 
          this.embeddings
        );
      } catch (error) {
        console.error('Error processing PDF:', error);
        throw new Error('Failed to process PDF');
      }
    }
  
    async retrieveContext(query: string, topK: number = 3): Promise<string> {
      if (!this.vectorStore) {
        throw new Error('No PDF processed. Call processPDF first.');
      }
  
      const retrievedDocs = await this.vectorStore.similaritySearch(query, topK);
  
      return retrievedDocs
        .map(doc => doc.pageContent)
        .join('\n\n---\n\n');
    }
  
    async generateResponseWithContext(
      query: string, 
      context: string
    ): Promise<string> {
      const payload = {
        contents: [
          {
            parts: [{ 
              text: `Context:\n${context}\n\nQuery: ${query}\n\nGenerate a comprehensive response based on the context.` 
            }]
          }
        ]
      };
  
      try {
        const response = await axios.post(
          `${GEMINI_URL}?key=${API_KEY}`, 
          payload, 
          { headers: { "Content-Type": "application/json" } }
        );
  
        if (response.data.candidates) {
          return response.data.candidates
            .map((candidate: any) => candidate?.content?.parts[0]?.text || "No text provided.")
            .join('\n');
        }
  
        throw new Error('No candidates found in the response');
      } catch (error: any) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        throw new Error(error.message || 'API call failed');
      }
    }
  
    // Main RAG workflow
    async processQuery(filePath: string, query: string): Promise<string> {
      await this.processPDF(filePath);
      const context = await this.retrieveContext(query);
      return this.generateResponseWithContext(query, context);
    }
  }
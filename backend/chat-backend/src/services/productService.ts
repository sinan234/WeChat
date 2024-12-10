import axios from 'axios';
import  pdf from 'pdf-parse';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { promises as fs } from 'fs';

const FAKE_STORE_API = "https://fakestoreapi.com/products";

export const extractPDFText = async (filePath: string): Promise<string> => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    
    const pdfData = await pdf(dataBuffer);
    
    return pdfData.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const splitTextIntoChunks = async (
  text: string,
  chunkSize = 1000,
  chunkOverlap = 200
): Promise<Document[]> => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  return textSplitter.createDocuments([text]);
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(FAKE_STORE_API);
    return response.data;
  } catch (error:any) {
    console.error('Error fetching products:', error.message);
    throw new Error('Failed to fetch products from API');
  }
};

export const searchProduct = (query: string, products: any[]) => {
  const lowerCaseQuery = query.toLowerCase();

  return products.find((product) =>
    product.title.toLowerCase().includes(lowerCaseQuery) ||
    product.description.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery)
  );
};


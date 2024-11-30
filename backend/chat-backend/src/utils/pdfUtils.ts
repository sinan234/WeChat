const fs = require('fs');
const pdf = require('pdf-parse');

export const extractTextFromPDF = async (filePath: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  fs.unlinkSync(filePath); 
  return data.text;
};

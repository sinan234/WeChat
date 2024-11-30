<<<<<<< HEAD
# WeChat
Chat Application with LLM Integration

This is a full-stack chat application built with Angular for the frontend and Node.js for the backend. It integrates the Gemini API for generating AI responses and supports PDF uploads for extracting text and appending it to user messages. The application uses Bootstrap for styling and MongoDB for persistent chat history storage. Real-time updates are implemented using Server-Sent Events (SSE).

Features

Backend Features
AI-Powered Chat: Uses the Gemini API to generate AI responses to user messages.
PDF Text Extraction: Upload PDFs, extract text, and combine it with user messages for processing.
Real-time Updates: Keeps the UI updated with new messages in real-time using SSE.
Persistent Storage: Stores chat history in MongoDB, including user messages and AI responses.

Frontend Features
User Interface: Built using Angular and styled with Bootstrap.
Real-Time Display: Updates the chat interface in real-time when new messages are received.
File Upload Support: Allows users to upload PDF files to enhance their queries.
Clear Chat History

Technologies Used
Backend
Node.js
Express.js
MongoDB
Multer (for handling file uploads)
pdf-parse (for extracting text from PDF files)
Axios (for interacting with the Gemini API)

Frontend
Angular (for UI and logic)
Bootstrap (for responsive and clean styling)

# ChatApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
>>>>>>> bf1adb8 (initial commit)

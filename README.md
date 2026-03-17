# 🌌 CodeSentinel

**CodeSentinel** is a high-performance, AI-powered code review tool designed for developers who value both insight and aesthetics. Featuring the premium **"Midnight Sapphire"** theme, it provides real-time, streaming analysis of your source code using Google's latest **Gemini 2.5 Flash** model.

## ✨ Features

- **Premium UI/UX**: A custom "Midnight Sapphire" aesthetic with deep slates, indigo accents, and sophisticated micro-animations.
- **Real-time Streaming**: Instant feedback as the AI analyzes your code, powered by efficient server-sent events.
- **Gemini 2.5 Flash Integration**: Leverages the latest generative AI for high-speed, accurate code defect detection.
- **Quality Heuristic Scoring**: Provides a 1-10 "System Health" score for every code snippet.
- **Proposed Resolutions**: Not just issues—get ready-to-use code fixes with syntax highlighting.
- **Zero-Friction Analysis**: Simply paste and scan. Supports TypeScript, JavaScript, Python, and more.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **AI Engine**: Google Gemini 2.5 Flash (via `@google/generative-ai`)
- **Animations**: Framer Motion & CSS keyframes
- **Code Highlighting**: Highlight.js

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CodeSentinel.git
cd CodeSentinel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the results.

## 🧠 How it Works

1. **Extraction**: The user pastes code into the custom-built, synchronized editor.
2. **Analysis**: Code is sent via a POST request to `/api/review`, which initializes a streaming session with Gemini 2.5 Flash.
3. **JSON Heuristics**: The AI is forced into **JSON Mode** to ensure structured, reliable review data.
4. **Streaming Render**: The frontend parses the incoming stream using a robust regex-based extraction logic, updating the UI as the AI "thinks."
5. **Quality Scoring**: A final 1-10 score is calculated based on best practices, security, and performance.

## 📄 License
MIT

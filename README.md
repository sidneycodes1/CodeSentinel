# CodeSentinel

## Overview
CodeSentinel is an automated code review application that uses the Google Gemini API to provide structural feedback and targeted suggestions for developers. It features a streaming web interface where users can paste source code, select a language environment, and receive real-time, line-by-line technical audits.

## Features
- Syntax-highlighted code editor overlay with line tracking.
- Streaming evaluation engine for immediate feedback rendering.
- Inline text selection mapped to keyboard shortcuts (Ctrl+Shift+E) for localized code explanations.
- Dynamic issue mapping that binds review feedback to specific line numbers.

## Tech Stack
- Frontend: Next.js 14, React 18, Tailwind CSS
- AI Integration: Google Generative AI SDK (@google/generative-ai)
- Language: TypeScript
- Syntax Highlighting: highlight.js

## Installation

Ensure you have Node.js installed on your system.

1. Clone the repository:
   git clone https://github.com/sidneycodes1/CodeSentinel.git
   cd CodeSentinel

2. Install dependencies:
   npm install

3. Configure environment variables:
   Create a `.env.local` file in the root directory and add your API key.
   GEMINI_API_KEY=your_google_ai_studio_api_key_here

4. Start the development server:
   npm run dev

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Paste the source code into the primary editor pane.
3. Select the appropriate programming language from the dropdown menu.
4. Click the review button to trace the diagnostic output in the right-hand panel.

To get an explanation for a specific block of code without triggering a full review, highlight the target text and press `Ctrl+Shift+E`.

## Project Structure

- `app/`: Next.js frontend pages and application layout.
- `app/api/`: Server-side route handlers, including the core streaming endpoints.
- `components/`: Modular React components handling the editor, toolbar, UI overlays, and review panels.
- `lib/`: Shared utilities, external API configuration, and LLM prompt definitions.
- `scripts/`: Development scripts for testing API connectivity and listing active models.

## API Endpoints

### POST `/api/review`
Accepts a block of code and streams back a technical review from the Gemini engine.

- Request Body (JSON):
  - `code` (string): The source code to evaluate.
  - `language` (string): The programming language.
  - `focus` (Optional array of strings): Specific areas to target in the review (e.g., security, performance).

- Response:
  Returns a server-sent event sequence that resolves to a JSON object containing a general score, summary, and an array of line-specific suggestions.

## Environment Variables

- `GEMINI_API_KEY`: Required string to authenticate with the Google Gemini API.

## Troubleshooting

- Missing API Configuration: If the terminal outputs authentication errors on boot or during a review, verify your `.env.local` file contains a valid `GEMINI_API_KEY`.
- Empty Responses: If the review panel stalls with no data, check the terminal for rate-limit warnings (429 status code) from the Gemini API.
- Parsing Errors: If the application fails to update the UI after a stream, the AI model may have returned an unexpected JSON format. Check the browser console or server logs.

## Contributing
Fork this repository and clone it to your local environment. Create a dedicated feature branch for any functionality additions or bug fixes. Please ensure your code follows the existing style patterns and run standard checks before submitting a pull request.

## License
MIT License

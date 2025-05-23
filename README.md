# AI Tutor App

This is an AI-powered tutor application built with Next.js. It provides assistance with various subjects, leveraging AI agents for math and physics.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.x or later recommended)
- npm, yarn, pnpm, or bun

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ai-tutor-app
    ```

2.  **Install dependencies:**
    Choose your preferred package manager:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add any necessary environment variables. For example:
    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    ```
    *(Note: Obtain your Gemini API key from Google AI Studio or your cloud console.)*

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the main page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

The project follows a standard Next.js App Router structure:

```
ai-tutor-app/
├── public/                 # Static assets (images, fonts, etc.)
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│   └── images/
│       └── logo.svg
├── src/
│   ├── app/                # Main application code (App Router)
│   │   ├── api/            # API routes
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   ├── chat/           # Chat interface pages
│   │   │   ├── client-page.tsx
│   │   │   └── page.tsx
│   │   ├── components/     # Reusable React components
│   │   │   ├── agents/     # Agent-specific UI (if any)
│   │   │   ├── chat/       # Chat UI components
│   │   │   ├── landing/    # Landing page components
│   │   │   └── ui/         # General UI elements (buttons, containers)
│   │   ├── lib/            # Libraries, helpers, and utilities
│   │   │   ├── agents/     # Core agent logic (math, physics, tutor)
│   │   │   ├── tools/      # Tools used by agents (calculator, formula lookup)
│   │   │   └── utils/      # General utility functions
│   │   ├── favicon.ico
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   ├── loading.tsx     # Loading UI
│   │   ├── not-found.tsx   # Not found page
│   │   ├── page.tsx        # Main landing page
│   │   └── theme.css       # Theme-specific styles
│   ├── eslint.config.mjs   # ESLint configuration
│   ├── next-env.d.ts       # Next.js TypeScript declarations
│   ├── next.config.ts      # Next.js configuration
│   ├── package.json        # Project dependencies and scripts
│   ├── postcss.config.mjs  # PostCSS configuration
│   ├── README.md           # This file
└── └── tsconfig.json       # TypeScript configuration
```

Key directories:
-   `src/app/api/`: Backend API endpoints.
-   `src/app/chat/`: Contains the main chat interface.
-   `src/app/components/`: Shared UI components used throughout the application.
-   `src/app/lib/agents/`: Defines the core logic for different AI agents (e.g., `MathAgent`, `PhysicsAgent`).
-   `src/app/lib/tools/`: Contains tools that agents can use (e.g., `Calculator`, `FormulaLookup`).
-   `src/app/lib/utils/`: Utility functions, including the `GeminiService` for interacting with the Gemini API.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

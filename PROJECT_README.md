# AI Tutor Multi-Agent System

A sophisticated multi-agent tutoring system built with Next.js and the Gemini API. This system uses principles from Google's Agent Development Kit (ADK) to create a distributed agent architecture that can answer questions across multiple subjects.

## Features

- **Tutor Agent**: Main coordinator that delegates tasks to specialized sub-agents
- **Specialist Agents**: Math Agent and Physics Agent with domain-specific knowledge
- **Tool Integration**: Specialized tools for calculations, formula lookup, etc.
- **Modern UI**: Clean, responsive interface for a seamless learning experience
- **Conversation Context**: Maintains context throughout the tutoring session

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **AI Backend**: Google's Gemini API
- **Deployment**: Vercel/Railway
- **Architecture**: Multi-agent system based on ADK principles

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-tutor-app.git
cd ai-tutor-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Architecture

The application follows a multi-agent architecture:

- **Tutor Agent**: Analyzes user queries and delegates to appropriate specialist agents
- **Math Agent**: Handles mathematics-related questions and uses calculation tools
- **Physics Agent**: Processes physics-related queries with formula lookup capabilities
- **Tools**: Specialized utilities that agents can use to solve specific problems

## Deployment

The application is deployed on [Vercel/Railway] and can be accessed at [your-deployed-url].

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google's Agent Development Kit for inspiring the architecture
- Next.js team for the amazing framework
- Gemini API for powering the AI capabilities

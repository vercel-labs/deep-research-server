# Sample MCP Server for ChatGPT Deep Research

This is a sample Model Context Protocol (MCP) server designed to work with ChatGPT's Deep Research feature. It provides semantic search through OpenAI's Vector Store API and document retrieval capabilities, demonstrating how to build custom MCP servers that can extend ChatGPT with company-specific knowledge and tools.

## Features

- **Search Tool**: Semantic search using OpenAI Vector Store API
- **Fetch Tool**: Complete document retrieval by ID with full content and metadata
- **Sample Data**: Includes 5 sample documents covering various technical topics
- **MCP Compliance**: Follows [OpenAI's MCP specification](https://platform.openai.com/docs/mcp#test-and-connect-your-mcp-server) for deep research integration

## Usage

This sample app uses the [Vercel MCP Adapter](https://www.npmjs.com/package/mcp-handler) that allows you to drop in an MCP server on a group of routes in any Next.js project.

Update `app/mcp/route.ts` with your tools, prompts, and resources following the [MCP TypeScript SDK documentation](https://github.com/modelcontextprotocol/typescript-sdk/tree/main?tab=readme-ov-file#server).

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm i
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   ```

## Connecting to ChatGPT Deep Research

1. **Access ChatGPT Settings**: Go to [ChatGPT settings](https://chatgpt.com/#settings) 
2. **Navigate to Connectors**: Click on the "Connectors" tab
3. **Add MCP Server**: Add your server URL: `http://your-domain/mcp`
4. **Test Connection**: The server should appear as available for deep research

## Notes for running on Vercel

- Make sure you have [Fluid compute](https://vercel.com/docs/functions/fluid-compute) enabled for efficient execution
- [Deploy the ChatGPT Deep Research Template](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fdeep-research-server)

## Sample Client

`script/test-client.mjs` contains a sample client to try invocations.

```sh
node scripts/test-client.mjs https://mcp-for-next-js.vercel.app
```

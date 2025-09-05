import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const SAMPLE_DOCUMENTS = [
  {
    id: "doc_1",
    title: "Next.js Performance Best Practices",
    text: "Next.js offers several optimization techniques to improve application performance. Key strategies include: Image optimization using next/image component, automatic code splitting for faster page loads, static site generation (SSG) for pre-rendered pages, server-side rendering (SSR) for dynamic content, and implementing proper caching strategies. The framework also provides built-in analytics and Core Web Vitals monitoring to track performance metrics.",
    url: "https://nextjs.org/docs/performance"
  },
  {
    id: "doc_2", 
    title: "React Server Components Guide",
    text: "React Server Components represent a new paradigm in React development, allowing components to render on the server and stream to the client. This approach reduces bundle size, improves initial page load times, and enables better SEO. Server Components can fetch data directly without client-side API calls, reducing network waterfalls. They work seamlessly with Client Components, which handle interactivity and browser-only features like event handlers and state management.",
    url: "https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components"
  },
  {
    id: "doc_3",
    title: "TypeScript Advanced Types",
    text: "TypeScript's advanced type system includes powerful features like conditional types, mapped types, and template literal types. Conditional types allow type selection based on conditions, while mapped types transform existing types by iterating over their properties. Template literal types enable string manipulation at the type level. Utility types like Pick, Omit, and Record provide common type transformations. These features enable creating robust, type-safe APIs and better developer experiences.",
    url: "https://typescriptlang.org/docs/handbook/2/types-from-types.html"
  },
  {
    id: "doc_4",
    title: "Vercel Deployment Strategies",
    text: "Vercel provides multiple deployment strategies for modern web applications. The platform supports automatic deployments from Git repositories, preview deployments for pull requests, and custom domains with SSL certificates. Edge Functions enable serverless computing at the edge for improved performance. The platform also offers analytics, monitoring, and A/B testing capabilities. Integration with popular frameworks like Next.js, Nuxt, and SvelteKit provides optimized deployment experiences.",
    url: "https://vercel.com/docs/concepts/deployments/overview"
  },
  {
    id: "doc_5",
    title: "Model Context Protocol (MCP) Specification",
    text: "The Model Context Protocol (MCP) is an open standard that enables secure connections between AI applications and data sources. MCP allows AI models to access external tools, databases, and APIs while maintaining security and user control. The protocol supports various transport mechanisms including HTTP and WebSocket connections. Key features include tool invocation, resource access, and prompt templates. MCP servers can be built in any language and integrated with different AI platforms.",
    url: "https://spec.modelcontextprotocol.io/"
  }
];

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "search",
      "Search for documents using semantic search. This tool searches through the document store to find semantically relevant matches. Returns a list of search results with basic information. Use the fetch tool to get complete document content.",
      {
        query: z.string().describe("Search query string. Natural language queries work best for semantic search."),
      },
      async ({ query }) => {
        if (!query || !query.trim()) {
          return {
            content: [{ type: "text", text: JSON.stringify({ results: [] }, null, 2) }],
          };
        }

        // Simple keyword-based search for demonstration
        const searchTerms = query.toLowerCase().split(' ');
        const results = SAMPLE_DOCUMENTS
          .map(doc => {
            const titleScore = searchTerms.reduce((score, term) => 
              doc.title.toLowerCase().includes(term) ? score + 2 : score, 0);
            const textScore = searchTerms.reduce((score, term) => 
              doc.text.toLowerCase().includes(term) ? score + 1 : score, 0);
            return { ...doc, score: titleScore + textScore };
          })
          .filter(doc => doc.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(doc => ({
            id: doc.id,
            title: doc.title,
            text: doc.text.substring(0, 200) + (doc.text.length > 200 ? "..." : ""),
            url: doc.url
          }));

        return {
          content: [{ type: "text", text: JSON.stringify({ results }, null, 2) }],
        };
      }
    );

    server.tool(
      "fetch",
      "Retrieve complete document content by ID for detailed analysis and citation. This tool fetches the full document content from the document store. Use this after finding relevant documents with the search tool to get complete information for analysis and proper citation.",
      {
        id: z.string().describe("Document ID from search results (e.g., doc_1, doc_2, etc.)"),
      },
      async ({ id }) => {
        if (!id) {
          throw new Error("Document ID is required");
        }

        const document = SAMPLE_DOCUMENTS.find(doc => doc.id === id);
        
        if (!document) {
          throw new Error(`Document with ID '${id}' not found`);
        }

        const result = {
          id: document.id,
          title: document.title,
          text: document.text,
          url: document.url,
          metadata: {
            source: "sample_data",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          }
        };

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        search: {
          description: "Search for documents using semantic search",
        },
        fetch: {
          description: "Retrieve complete document content by ID",
        },
      },
    },
  },
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };

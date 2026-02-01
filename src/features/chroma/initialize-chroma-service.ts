import { OpenAIEmbeddingFunction } from "@chroma-core/openai";
import { ChromaClient } from "chromadb";

export const initializeChromaService = async () => {
  const client = new ChromaClient({
    database: "knowledge_base",
  });

  const collection = await client.getOrCreateCollection({
    name: "docs",
    embeddingFunction: new OpenAIEmbeddingFunction({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-small",
    }),
    metadata: {
      description: "Rag vector DB",
      created: new Date().toString(),
    },
  });

  return collection;
};

import { type Collection } from "chromadb";

export class ChromaService {
  constructor(private readonly collection: Collection) {}

  async addDocuments(id: string, text: string) {
    await this.collection.add({
      ids: [id],
      documents: [text],
    });
  }
}

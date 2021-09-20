import { Collection, MongoClient, Document } from "mongodb";

type MongoHelpertype = {
  client: MongoClient | null;
  connect: (url: string) => Promise<void>;
  disconnect: () => Promise<void>;
  getConnection: (name: string) => Collection | null;
  map: (collection: Document) => any;
};

export const MongoHelper: MongoHelpertype = {
  client: null,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    await this.client?.close();
  },

  getConnection(name: string): Collection | null {
    return this.client?.db().collection(name) || null;
  },

  map(collection: Document): any {
    const { _id, ...collectionWithOutId } = collection;

    return {
      id: _id.id.toString(),
      ...collectionWithOutId,
    };
  },
};

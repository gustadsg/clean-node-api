import { Collection, MongoClient, Document } from "mongodb";

type MongoHelpertype = {
  client: MongoClient | null;
  url: string | null;
  connect: (url: string) => Promise<void>;
  disconnect: () => Promise<void>;
  getConnection: (name: string) => Promise<Collection | null>;
  map: (collection: Document) => any;
};

export const MongoHelper: MongoHelpertype = {
  client: null,
  url: null,

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    if (this.client) await this.client.close();
  },

  async getConnection(name: string): Promise<Collection | null> {
    if (!this.client) await this.connect(this.url || "");
    return this.client?.db().collection(name) || null;
  },

  map(collection: Document): any {
    const { _id, ...collectionWithOutId } = collection;

    return {
      id: _id.id.toString("hex"),
      ...collectionWithOutId,
    };
  },
};

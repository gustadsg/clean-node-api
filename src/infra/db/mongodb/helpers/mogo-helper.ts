import { MongoClient } from "mongodb";

type MongoHelpertype = {
  client: MongoClient | null;
  connect: (url: string) => Promise<void>;
  disconnect: () => Promise<void>;
};

export const MongoHelper: MongoHelpertype = {
  client: null,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url);
  },

  async disconnect(): Promise<void> {
    await this.client?.close();
  },
};

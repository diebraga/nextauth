import { Db, MongoClient } from 'mongodb'

interface ConnectionType {
  db: Db;
  client: MongoClient;
}

const client = new MongoClient(<string>process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export default async function connect(): Promise<ConnectionType> {
  if (!client.isConnected()) await client.connect()

  const db = client.db('translate') // database name
  return { db, client }
}
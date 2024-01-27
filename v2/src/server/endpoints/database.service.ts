import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import {User} from "./user.interface";

export const collections: { users?: mongoDB.Collection<User> } = {}

export async function connectToDatabase () {
    dotenv.config();

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
    await client.connect();
    const db: mongoDB.Db = client.db();
    collections.users = db.collection<User>(process.env.USERS_COLLECTION_NAME!);
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${collections.users.collectionName}`);
}
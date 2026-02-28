import { MongoClient } from "mongodb";
// https://cloud.mongodb.com/v2/695985c43d0d6450209b76da#/explorer/69598603c3304d5c8460068d/node-project/todo/find
const url = "mongodb+srv://nikkishakya786_db_user:jhHODVEuZbyLukYe@cluster0.3jdnxw7.mongodb.net/";
// mongodb+srv://nikkishakya786_db_user:jhHODVEuZbyLukYe@cluster0.3jdnxw7.mongodb.net/
export const collectionName = "todo";
const dbName = "node-project";
const client = new MongoClient(url);

export const connection = async () => {
    const connect = await client.connect();
    return await connect.db(dbName);
}

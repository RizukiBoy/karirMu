const {MongoClient} = require("mongodb");

const client = new MongoClient(process.env.MONGO_URL)

async function connectDB() {
  await client.connect();
  console.log("mongodb connected")
}

module.exports = {client, connectDB}
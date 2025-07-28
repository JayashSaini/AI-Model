const mongoose = require('mongoose');
const { DB_NAME } = require('../constants.js');
const { QdrantClient } = require('@qdrant/js-client-rest');

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.info(
      '🌏 Mongodb Connecting successfully host : ' +
        connectionInstance.connection.host
    );
  } catch (error) {
    console.error('MongoDB connection error : ' + error);
    process.exit(1);
  }
}

const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URI,
  apiKey: process.env.QDRANT_API_KEY,
});

module.exports = { connectDB, qdrantClient };

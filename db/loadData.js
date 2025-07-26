// db/loadData.js
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const csv = require('csv-parser');
const { mongoURI, dbName } = require('../config');

const files = [
  { file: 'products.csv', collection: 'products' },
  { file: 'users.csv', collection: 'users' },
  { file: 'orders.csv', collection: 'orders' },
  { file: 'order_items.csv', collection: 'order_items' },
  { file: 'inventory_items.csv', collection: 'inventory_items' },
  { file: 'distribution_centers.csv', collection: 'distribution_centers' },
];

async function loadCSVToCollection(filePath, collectionName) {
  const client = new MongoClient(mongoURI);
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Attempt numeric conversion
        for (let key in data) {
          const val = data[key];
          if (!isNaN(val) && val.trim() !== '') {
            data[key] = Number(val);
          }
        }
        results.push(data);
      })
      .on('end', async () => {
        try {
          await client.connect();
          const db = client.db(dbName);
          const collection = db.collection(collectionName);
          if (results.length) {
            await collection.insertMany(results);
            console.log(`✅ ${collectionName}: ${results.length} records inserted.`);
          }
          await client.close();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
}

async function run() {
  for (const { file, collection } of files) {
    const filePath = path.join(__dirname, '../data', file);
    try {
      await loadCSVToCollection(filePath, collection);
    } catch (err) {
      console.error(`❌ Failed to load ${file}:`, err.message);
    }
  }
}

run();

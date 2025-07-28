// storeEmployeesToQdrant.js

const { employees } = require('../data/employees.json');
const { formatEmployee } = require('../utils');
const { qdrantClient } = require('../db');
const { getEmbedding } = require('./transformer');
const { v4: uuidv4 } = require('uuid');

async function storeEmployeesToQdrant() {
  await qdrantClient.recreateCollection('employees', {
    vectors: { size: 384, distance: 'Cosine' },
  });

  for (const emp of employees) {
    const text = formatEmployee(emp);
    const vector = await getEmbedding(text);

    await qdrantClient.upsert('employees', {
      points: [
        {
          id: uuidv4(), // Use employee_id as id (string or number)
          vector, // Should be a flat array of numbers
          payload: { ...emp }, // Spread all employee fields
        },
      ],
    });

    console.log(`✅ Stored ${emp.name} in Qdrant`);
  }

  console.log('🎉 All employee data embedded and stored.');
}

module.exports = { storeEmployeesToQdrant };

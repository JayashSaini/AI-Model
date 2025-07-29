const { qdrantClient } = require('../db');
const { getEmbedding } = require('../service/transformer');
const { ApiResponse } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const { asyncHandler } = require('../utils/asyncHandler');
const axios = require('axios');
const { extractFiltersAndBuildQdrant, trimContext } = require('../utils');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) throw new ApiError(400, 'Message is required');

  // Step 1: Get Embedding
  console.time('🧠 Embedding Generation');
  const embeddingResult = await getEmbedding(message);
  console.timeEnd('🧠 Embedding Generation');

  if (!embeddingResult?.[0]?.data) {
    throw new ApiError(500, 'Invalid embedding structure');
  }
  const embedding = Array.from(embeddingResult[0].data);

  const qdrantQuery = {
    vector: embedding,
    limit: 5,
    score_threshold: 0.2,
    with_payload: true,
  };

  // Step 2: Search Qdrant
  let relevantData;
  console.time('🔍 Qdrant Vector Search');
  try {
    relevantData = await qdrantClient.search('employees', qdrantQuery);
  } catch (err) {
    console.timeEnd('🔍 Qdrant Vector Search');
    console.error('Qdrant search error:', err);
    throw new ApiError(500, 'Error searching Qdrant vector DB');
  }
  console.timeEnd('🔍 Qdrant Vector Search');

  // Step 3: Prepare Context
  const contextChunks = relevantData
    .map((item) => JSON.stringify(item.payload))
    .join('\n');

  // Step 4: Call AI API
  console.time('🤖 AI Response Generation');
  const aiResponse = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'qwen/qwen3-235b-a22b-2507:free',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI assistant that answers user questions strictly using the context provided. Keep answers accurate and under 100 words.',
        },
        {
          role: 'user',
          content: `Context:\n${contextChunks}\n\nQuestion: ${message}`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.timeEnd('🤖 AI Response Generation');

  const aiText =
    aiResponse.data.choices?.[0]?.message?.content || 'No response from AI';

  // Step 5: Final Response
  res.status(200).json(
    new ApiResponse({
      result: aiText,
      prompt: message,
    })
  );
});

module.exports = { sendMessage };

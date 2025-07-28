// loadTransformer.js (CommonJS compatible)
let extractor = null;

async function loadEmbeddingModel() {
  if (!extractor) {
    const { pipeline } = await import('@xenova/transformers');
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return extractor;
}

async function getEmbedding(text) {
  const model = await loadEmbeddingModel();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return output[0];
}

module.exports = { getEmbedding };

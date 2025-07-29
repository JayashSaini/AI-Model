require('dotenv').config({
  path: './.env',
});
const { app } = require('./app.js');
const { connectDB } = require('./db/index.js');
const { storeEmployeesToQdrant } = require('./service/index.js');

(async () => {
  // connect mongodb database
  await connectDB();

  await storeEmployeesToQdrant();

  // start http server
  app.listen(process.env.PORT, () => {
    console.log(`🚝 Server is running on port ${process.env.PORT}`);
  });
})();

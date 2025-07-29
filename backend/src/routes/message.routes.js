const { Router } = require('express');
const router = Router();
const { sendMessage } = require('../controllers/message.controllers.js');

//unsecured routes
router.route('/send').post(sendMessage);

module.exports = router;
